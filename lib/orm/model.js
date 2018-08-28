/// <reference path="../../@types/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const model_property_1 = require("./model.property");
const model_instance_1 = require("./model.instance");
const settings_1 = require("./settings");
const _utils_1 = require("./_utils");
/**
 * ClassORMModel
 *
 */
class ClassORMModel {
    constructor(name, properties, settings) {
        this.extends = {};
        if (!name)
            throw `model's name required.`;
        this.name = name;
        this.settings = new settings_1.default(settings);
        this.properties = new model_property_1.default(this, properties)._props;
    }
    /* basic member field :end */
    new(fields, options) {
        options.model = this;
        return new model_instance_1.default(fields, options);
    }
    get __associations() { return this.extends; }
    sync(callback) {
        return this;
    }
    /**
     * sync model configuration to database.
     *
     * - create table if it doesn't existed
     * - throw exception when table existed
     */
    syncSync() {
        // TODO: ensure table in db
    }
    drop(callback) {
        return this;
    }
    /**
     * drop table of ClassORMModel
     */
    dropSync() {
        // TODO: drop table in db
    }
    get() {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * get one row data from table
     */
    getSync() {
        return new model_instance_1.default({}, { model: this });
    }
    find(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * find row data list from table
     */
    findSync() {
        return new model_instance_1.default({}, { model: this });
    }
    all(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * all row data list from table
     */
    allSync() {
        return new model_instance_1.default({}, { model: this });
    }
    one(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * one row data list from table
     */
    oneSync() {
        return new model_instance_1.default({}, { model: this });
    }
    count(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * count row data list from table
     */
    countSync() {
        return new model_instance_1.default({}, { model: this });
    }
    first(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * first row data list from table
     */
    firstSync() {
        return new model_instance_1.default({}, { model: this });
    }
    last(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * last row data list from table
     */
    lastSync() {
        return new model_instance_1.default({}, { model: this });
    }
    where(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * where row data list from table
     */
    whereSync() {
        return new model_instance_1.default({}, { model: this });
    }
    exists(...args) {
        return new model_instance_1.default({}, { model: this });
    }
    /**
     * check if one field with conditions exists
     */
    existsSync() {
        return new model_instance_1.default({}, { model: this });
    }
    create(...args) {
        return this.createSync(...args);
    }
    /**
     * create one instance of Model
     */
    createSync(objectData = {}) {
        return new model_instance_1.default(objectData, {
            model: this
        });
    }
    run(...args) {
        return this;
    }
    /**
     * run row data list from table
     */
    runSync() {
        return this;
    }
    /**
     * clear all fields, reset model to empty one
     */
    clear() {
        return this;
    }
    aggregate() {
        return null;
    }
    /* association about :start */
    /**
     * associate another model with one-one relationship,
     *
     * it would auto-generate method
     * - set[AssociationName]Sync, which would set the associated Model's instance
     * - find[AssociationName]Sync, which would return the associated Model's instance
     */
    hasOne(associationName, associatedModel, options = {}) {
        if (!associationName)
            throw `${'hasOne'}associationName required!`;
        const associationConfig = this.extends[associationName] = _utils_1.buildModelAssociationConfiguration(associationName, 'hasOne', associatedModel, options.reverse);
        if (_utils_1.shouldHelpAssociatedModelLinkRelationShip(associatedModel, associationConfig)) {
            associationConfig.model.hasOne(associationConfig.reverse_name, this, _utils_1.getAssociatedModelTobeLinkedOptions(options));
        }
    }
    /**
     * associate another model with one-one relationship,
     *
     * it would auto-generate method
     * - set[AssociationName]Sync, which would set the associated Model's instance
     * - find[AssociationName]Sync, which would return the associated Model's instance
     */
    hasMany(associationName, associatedModel, related_fields, options) {
        if (!associationName)
            throw `${'hasMan'}associationName required!`;
        if (related_fields && options === undefined) {
            options = related_fields;
            related_fields = {};
        }
        options = options || {};
        const associationConfig = this.extends[associationName] = _utils_1.buildModelAssociationConfiguration(associationName, 'hasMany', associatedModel, options.reverse);
        if (_utils_1.shouldHelpAssociatedModelLinkRelationShip(associatedModel, associationConfig)) {
            associationConfig.model.hasMany(associationConfig.reverse_name, this, related_fields, _utils_1.getAssociatedModelTobeLinkedOptions(options));
        }
    }
    extendsTo(extendName, properties) {
        const model = new ClassORMModel(extendName, properties);
        this.extends[extendName] = {
            name: extendName,
            type: 'extendsTo',
            model: model,
            reverse_name: ''
        };
        return model;
    }
}
exports.default = ClassORMModel;
function ModelClass(opts) {
    const model = function () {
        const _model = ClassORMModel.call(this, opts.table, opts.properties);
    };
    // return model;
    return model;
}
exports.ModelClass = ModelClass;
