/// <reference path="../../@types/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const url = require("url");
const settings_1 = require("./settings");
const validators_1 = require("./validators");
const model_1 = require("./model");
class ORM extends events.EventEmitter {
    constructor() {
        super();
        this.models = {};
        this.settings = new settings_1.default({});
        this.driver_name = 'mysql';
    }
    /**
     * connect one databse backend, get one ORM instance
     * @param connString
     */
    static connectSync(connString) {
        return new ORM();
    }
    static parseConnectString(connString) {
        return url.parse('mysql://root:root@localhost:3306/rx-db');
    }
    use(plugin, options) {
        return this;
    }
    ping(callback) {
        return this;
    }
    close(callback) {
        return this;
    }
    closeSync() {
        return this;
    }
    load(file, callback) {
    }
    loadSync(file) {
    }
    sync(callback) {
        return this;
    }
    syncSync() {
        return this;
    }
    drop(callback) {
        return this;
    }
    dropSync() {
        return this;
    }
    begin() {
    }
    commit() {
    }
    rollback() {
    }
    trans(func) {
    }
    /**
     * define one model
     */
    define(modelName, properties, opts) {
        // return new ClassORMModel(modelName, properties)
        this.models[modelName] = new model_1.ModelClass({
            db: this,
            settings: this.settings,
            driver_name: this.driver_name,
            driver: this.driver,
            table: opts.table || opts.collection || ((this.settings.get("model.namePrefix") || "") + modelName),
            properties: properties,
            extension: opts.extension || false,
            indexes: opts.indexes || [],
            identityCache: opts.hasOwnProperty('identityCache') ? opts.identityCache : this.settings.get("instance.identityCache"),
            keys: opts.id,
            autoSave: opts.hasOwnProperty('autoSave') ? opts.autoSave : this.settings.get("instance.autoSave"),
            autoFetch: opts.hasOwnProperty('autoFetch') ? opts.autoFetch : this.settings.get("instance.autoFetch"),
            autoFetchLimit: opts.autoFetchLimit || this.settings.get("instance.autoFetchLimit"),
            cascadeRemove: opts.hasOwnProperty('cascadeRemove') ? opts.cascadeRemove : this.settings.get("instance.cascadeRemove"),
            hooks: opts.hooks || {},
            methods: opts.methods || {},
            validations: opts.validations || {}
        });
        return this.models[modelName];
    }
}
/* static methods && variables :start */
ORM.validators = validators_1.default;
exports.default = ORM;
