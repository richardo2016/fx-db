Object.defineProperty(exports, "__esModule", { value: true });
const _utils_1 = require("./_utils");
const model_1 = require("./model");
/**
 * ClassORMModelInstance
 *
 */
class ClassORMModelInstance {
    constructor(fields, options) {
        // _kvs: ProxyHandler<object> = {};
        this._kvs = {};
        this.__opts = {
            model: null,
            one_associations: [],
            many_associations: [],
            extend_associations: [],
            association_properties: null,
            fieldToPropertyMap: null
        };
        if (!options.model || !(options.model instanceof model_1.default))
            throw `typed-model is required`;
        this.__opts.model = options.model;
        _initializeFrom__Opts.call(this);
        Object.keys(fields).forEach(k => {
            this._kvs[k] = fields[k];
        });
    }
    isInstance() {
        return false;
    }
    ;
    isPersisted() {
        return false;
    }
    ;
    isShell() {
        return false;
    }
    ;
    /**
     *
     * @param event register one event
     * @param callback
     */
    on(event, callback) {
        return null;
    }
    ;
    firstSync(...args) { return this.__opts.model.firstSync(...args); }
    lastSync(...args) { return this.__opts.model.lastSync(...args); }
    countSync(...args) { return this.__opts.model.countSync(...args); }
    allSync(...args) { return this.__opts.model.allSync(...args); }
    whereSync(...args) { return this.__opts.model.whereSync(...args); }
    findSync(...args) { return this.__opts.model.findSync(...args); }
    runSync(...args) { return this.__opts.model.runSync(...args); }
    /**
     * save instance
     */
    // save(): ModelInstance {
    //     return null;
    // };
    // save(data: object, callback: ModelFunctionErrHandler): ModelInstance {
    //     return null
    // };
    save(data, options, callback) {
        return this;
    }
    ;
    saveSync(data, options, callback) {
        return this.save(data, options, callback);
    }
    ;
    remove(callback) {
        return this;
    }
    /**
     * remove row data list from table
     */
    removeSync() {
        return this;
    }
    set(field_name, field_value) {
        this._kvs[field_name] = field_value;
    }
    markAsDirty(field_name, field_value) {
        this.dirtyProperties[field_name] = true;
    }
    validate(callback) {
    }
}
function _initializeFrom__Opts() {
    const _extends = _utils_1.getModelExtendModelHash(this.__opts.model);
    Object.keys(_extends).forEach(extendName => {
        const associationConfig = _extends[extendName];
        switch (associationConfig.type) {
            case 'hasOne':
                this.__opts.one_associations.push(buildModelInstanceAssociationItem(associationConfig, 'hasOne'));
                break;
            case 'hasMany':
                this.__opts.one_associations.push(buildModelInstanceAssociationItem(associationConfig, 'hasMany'));
                break;
            case 'extendsTo':
                break;
        }
    });
    this.__opts.one_associations.forEach(association => {
        this[association.getAccessor] = function () { };
        this[association.setAccessor] = function () { };
    });
    this.__opts.many_associations.forEach(association => {
        this[association.getAccessor] = function () { };
        this[association.setAccessor] = function () { };
    });
}
function buildModelInstanceAssociationItem(associationConfig, assocType) {
    return {
        name: associationConfig.name,
        // TODO: ?
        field: null,
        getAccessor: _utils_1.buildAssociationMethodName('get', associationConfig.name, assocType),
        setAccessor: _utils_1.buildAssociationMethodName('set', associationConfig.name, assocType),
        hasAccessor: '',
        delAccessor: '',
        addAccessor: ''
    };
}
exports.default = ClassORMModelInstance;
