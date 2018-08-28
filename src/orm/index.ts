import util = require('util')
import uuid = require('uuid')
import events = require('events')

import DriverAliases  = require("./drivers/aliases");
import adapters       = require("./adapters");

import ORMError       = require("./error");
import Utilities      = require("./utilities");

// Deprecated, use enforce
export const validators = require("./validators")

export import enforce = require('@fibjs/enforce')
export const singleton = null
export const settings = null
export const Property = null
export const Settings = null
export const ErrorCodes = null
export const Text = null
export const express = null
export const use = function (connection, proto, opts, cb) {
	if (DriverAliases[proto]) {
		proto = DriverAliases[proto];
	}

	if (typeof opts === "function") {
		cb = opts;
		opts = {};
	}

	try {
		const Driver   = adapters.get(proto);
		const settings = new Settings.Container(exports.settings.get('*'));
		const driver   = new Driver(null, connection, {
			debug    : (opts.query && opts.query.debug === 'true'),
			settings : settings
		});

		return cb(null, new ORM(proto, driver, settings));
	} catch (ex) {
		return cb(ex);
	}
};
export const connect = null
export const addAdapter = null

function ORM(driver_name, driver, settings) {
	this.validators  = exports.validators;
	this.enforce     = exports.enforce;
	this.settings    = settings;
	this.driver_name = driver_name;
	this.driver      = driver;
	this.driver.uid  = uuid.snowflake().hex();
	this.tools       = {};
	this.models      = {};
	this.plugins     = [];
	this.customTypes = {};

	for (var k in Query.Comparators) {
		this.tools[Query.Comparators[k]] = Query[Query.Comparators[k]];
	}

	events.EventEmitter.call(this);

	var onError = function (err) {
		if (this.settings.get("connection.reconnect")) {
			if (typeof this.driver.reconnect === "undefined") {
				return this.emit("error", new ORMError("Connection lost - driver does not support reconnection", 'CONNECTION_LOST'));
			}
			this.driver.reconnect(function () {
				this.driver.on("error", onError);
			}.bind(this));

			if (this.listeners("error").length === 0) {
				// since user want auto reconnect,
				// don't emit without listeners or it will throw
				return;
			}
		}
		this.emit("error", err);
	}.bind(this);

	driver.on("error", onError);
}

util.inherits(ORM, events.EventEmitter);

ORM.prototype.use = function (plugin_const, opts) {
	if (typeof plugin_const === "string") {
		try {
			plugin_const = require(Utilities.getRealPath(plugin_const));
		} catch (e) {
			throw e;
		}
	}

	var plugin = new plugin_const(this, opts || {});

	if (typeof plugin.define === "function") {
		for (var k in this.models) {
			plugin.define(this.models[k]);
		}
	}

	this.plugins.push(plugin);

	return this;
};
ORM.prototype.define = function (name, properties, opts) {
    var i;

	properties = properties || {};
	opts       = opts || {};

	for (i = 0; i < this.plugins.length; i++) {
		if (typeof this.plugins[i].beforeDefine === "function") {
			this.plugins[i].beforeDefine(name, properties, opts);
		}
	}

	this.models[name] = new Model({
		db             : this,
		settings       : this.settings,
		driver_name    : this.driver_name,
		driver         : this.driver,
		table          : opts.table || opts.collection || ((this.settings.get("model.namePrefix") || "") + name),
		properties     : properties,
		extension      : opts.extension || false,
		indexes        : opts.indexes || [],
		identityCache       : opts.hasOwnProperty("identityCache") ? opts.identityCache : this.settings.get("instance.identityCache"),
		keys           : opts.id,
		autoSave       : opts.hasOwnProperty("autoSave") ? opts.autoSave : this.settings.get("instance.autoSave"),
		autoFetch      : opts.hasOwnProperty("autoFetch") ? opts.autoFetch : this.settings.get("instance.autoFetch"),
		autoFetchLimit : opts.autoFetchLimit || this.settings.get("instance.autoFetchLimit"),
		cascadeRemove  : opts.hasOwnProperty("cascadeRemove") ? opts.cascadeRemove : this.settings.get("instance.cascadeRemove"),
		hooks          : opts.hooks || {},
		methods        : opts.methods || {},
		validations    : opts.validations || {}
	});

	for (i = 0; i < this.plugins.length; i++) {
		if (typeof this.plugins[i].define === "function") {
			this.plugins[i].define(this.models[name], this);
		}
	}

	return this.models[name];
};
ORM.prototype.defineType = function (name, opts) {
	this.customTypes[name] = opts;
	this.driver.customTypes[name] = opts;
	return this;
};
ORM.prototype.ping = function (cb) {
	this.driver.ping(cb);

	return this;
};
ORM.prototype.close = function (cb) {
	this.driver.close(cb);

	return this;
};
ORM.prototype.load = function () {
	var files = _.flatten(Array.prototype.slice.apply(arguments));
	var cb    = function () {};

	if (typeof files[files.length - 1] == "function") {
		cb = files.pop();
	}

	var loadNext = function () {
		if (files.length === 0) {
			return cb();
		}

		var file = files.shift();

		try {
			return require(Utilities.getRealPath(file, 4))(this, function (err) {
				if (err) return cb(err);

				return loadNext();
			});
		} catch (ex) {
			return cb(ex);
		}
	}.bind(this);

	return loadNext();
};
ORM.prototype.sync = function (cb) {
	var modelIds = Object.keys(this.models);
	var syncNext = function () {
		if (modelIds.length === 0) {
			return cb();
		}

		var modelId = modelIds.shift();

		this.models[modelId].sync(function (err) {
			if (err) {
				err.model = modelId;

				return cb(err);
			}

			return syncNext();
		});
	}.bind(this);

	if (arguments.length === 0) {
		cb = function () {};
	}

	syncNext();

	return this;
};
ORM.prototype.drop = function (cb) {
	var modelIds = Object.keys(this.models);
	var dropNext = function () {
		if (modelIds.length === 0) {
			return cb();
		}

		var modelId = modelIds.shift();

		this.models[modelId].drop(function (err) {
			if (err) {
				err.model = modelId;

				return cb(err);
			}

			return dropNext();
		});
	}.bind(this);

	if (arguments.length === 0) {
		cb = function () {};
	}

	dropNext();

	return this;
};
ORM.prototype.serial = function () {
	var chains = Array.prototype.slice.apply(arguments);

	return {
		get: function (cb) {
			var params = [];
			var getNext = function () {
				if (params.length === chains.length) {
					params.unshift(null);
					return cb.apply(null, params);
				}

				chains[params.length].run(function (err, instances) {
					if (err) {
						params.unshift(err);
						return cb.apply(null, params);
					}

					params.push(instances);
					return getNext();
				});
			};

			getNext();

			return this;
		}
	};
};