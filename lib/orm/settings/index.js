Object.defineProperty(exports, "__esModule", { value: true });
const default_settings = {
    properties: {
        primary_key: "id",
        association_key: "{name}_{field}",
        required: false
    },
    instance: {
        identityCache: false,
        identityCacheSaveCheck: true,
        autoSave: false,
        autoFetch: false,
        autoFetchLimit: 1,
        cascadeRemove: true,
        returnAllErrors: false,
        saveAssociationsByDefault: true
    },
    hasMany: {
        // Makes the foreign key fields a composite key
        key: false
    },
    connection: {
        reconnect: true,
        pool: false,
        debug: false
    }
};
exports.Container = Settings;
function default_1() {
    return default_settings;
}
exports.default = default_1;
;
function Settings(settings) {
    this.settings = settings;
    return {
        set: function (key, value) {
            set(key, value, settings);
            return this;
        },
        get: function (key, def) {
            const v = get(key, def, settings);
            if (v instanceof Function) {
                return v;
            }
            else {
                return JSON.parse(JSON.stringify(v));
            }
        },
        unset: function () {
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === "string") {
                    unset(arguments[i], settings);
                }
            }
            return this;
        }
    };
}
function set(key, value, obj) {
    const p = key.indexOf(".");
    if (p === -1) {
        return obj[key] = value;
    }
    if (!obj.hasOwnProperty(key.substr(0, p))) {
        obj[key.substr(0, p)] = {};
    }
    return set(key.substr(p + 1), value, obj[key.substr(0, p)]);
}
function get(key, def, obj) {
    const p = key.indexOf(".");
    if (p === -1) {
        if (key === '*') {
            return obj;
        }
        return obj.hasOwnProperty(key) ? obj[key] : def;
    }
    if (!obj.hasOwnProperty(key.substr(0, p))) {
        return def;
    }
    return get(key.substr(p + 1), def, obj[key.substr(0, p)]);
}
function unset(key, obj) {
    const p = key.indexOf(".");
    if (p === -1) {
        if (key === '*') {
            return 'reset';
        }
        else {
            delete obj[key];
        }
        return;
    }
    if (!obj.hasOwnProperty(key.substr(0, p))) {
        return;
    }
    if (unset(key.substr(p + 1), obj[key.substr(0, p)]) === 'reset') {
        obj[key.substr(0, p)] = {};
    }
}