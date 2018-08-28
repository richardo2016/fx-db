/// <reference path="../../@types/index.d.ts" />

import ClassORMModelPropertyHash from './model.property';
import ClassORMModelInstance from './model.instance';
import ClassORMSettings from './settings';
import { buildModelAssociationConfiguration, shouldHelpAssociatedModelLinkRelationShip, getAssociatedModelTobeLinkedOptions } from './_utils';
import { enumerable } from '../decorators/class';

/**
 * ClassORMModel
 * 
 */

class ClassORMModel implements Model {
    /* basic member field :start */
    
    /**
     * uniq identifier in ORM
     */
    // @enumerable(false)
    id: string[]
    // @enumerable(false)
    name: string
    /**
     * table's name
     */
    // @enumerable(false)
    table: string

    properties: ModelPropertyHash;
    readonly allProperties: ModelPropertyHash;
    settings: ClassORMSettings

    InstanceClass: Function
    /* basic member field :end */

    new (fields: object, options: ModelInstanceInitOptions) {
        options.model = this
        return new ClassORMModelInstance(fields, options)
    }

    constructor (name, properties: ModelDefinitionPropertyHash, settings?: ORMSettings) {
        if (!name)
            throw `model's name required.`
        
        this.name = name

        this.settings = new ClassORMSettings(settings)
        this.properties = new ClassORMModelPropertyHash(this, properties)._props
    }

    extends: {[assoName: string]: ModelAssociationConfiguration} = {}
    get __associations () { return this.extends }

    sync (callback?: ModelFunctionErrHandler): Model {
        return this
    }
    /**
     * sync model configuration to database.
     * 
     * - create table if it doesn't existed
     * - throw exception when table existed
     */
    syncSync () {
        // TODO: ensure table in db
    }

    drop (callback?: ModelFunctionErrHandler): Model {
        return this
    }
    /**
     * drop table of ClassORMModel
     */
    dropSync () {
        // TODO: drop table in db
    }
    
    get (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * get one row data from table
     */
    getSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    find (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * find row data list from table
     */
    findSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    all (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * all row data list from table
     */
    allSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    one (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * one row data list from table
     */
    oneSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    count (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * count row data list from table
     */
    countSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    first (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * first row data list from table
     */
    firstSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    last (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * last row data list from table
     */
    lastSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    where (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * where row data list from table
     */
    whereSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    exists (...args: any[]): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }
    /**
     * check if one field with conditions exists
     */
    existsSync (): ModelInstance {
        return new ClassORMModelInstance({}, { model: this })
    }

    create (...args: any[]): ModelInstance {
        return this.createSync(...args)
    }
    /**
     * create one instance of Model
     */
    createSync (objectData: object = {}): ModelInstance {
        return new ClassORMModelInstance(objectData, {
            model: this
        })
    }

    run (...args: any[]): Model {
        return this
    }
    /**
     * run row data list from table
     */
    runSync (): Model {
        return this
    }

    /**
     * clear all fields, reset model to empty one
     */
    clear (): Model {
        return this
    }

    aggregate (): IAggregated {
        return null
    }

    /* association about :start */
    /**
     * associate another model with one-one relationship,
     * 
     * it would auto-generate method 
     * - set[AssociationName]Sync, which would set the associated Model's instance
     * - find[AssociationName]Sync, which would return the associated Model's instance
     */
    hasOne (associationName: string, associatedModel: ClassORMModel, options: ModelAssociationInitOptions__HasOne = {}) {
        if (!associationName)
            throw `${'hasOne'}associationName required!`

        const associationConfig = this.extends[associationName] = buildModelAssociationConfiguration(associationName, 'hasOne', associatedModel, options.reverse)

        if (shouldHelpAssociatedModelLinkRelationShip(associatedModel, associationConfig)) {
            associationConfig.model.hasOne(associationConfig.reverse_name, this, getAssociatedModelTobeLinkedOptions(options))
        }
    }

    /**
     * associate another model with one-one relationship,
     * 
     * it would auto-generate method 
     * - set[AssociationName]Sync, which would set the associated Model's instance
     * - find[AssociationName]Sync, which would return the associated Model's instance
     */
    hasMany (associationName: string, associatedModel: ClassORMModel, related_fields?: object, options?: ModelAssociationInitOptions__HasMany) {
        if (!associationName)
            throw `${'hasMan'}associationName required!`

        if (related_fields && options === undefined) {
            options = related_fields
            related_fields = {}
        }
        options = options || {}

        const associationConfig = this.extends[associationName] = buildModelAssociationConfiguration(associationName, 'hasMany', associatedModel, options.reverse)

        if (shouldHelpAssociatedModelLinkRelationShip(associatedModel, associationConfig)) {
            associationConfig.model.hasMany(associationConfig.reverse_name, this, related_fields, getAssociatedModelTobeLinkedOptions(options))
        }
    }

    extendsTo (extendName: string, properties: ModelDefinitionPropertyHash): Model {
        const model = new ClassORMModel(extendName, properties)

        this.extends[extendName] = {
            name: extendName,

            type: 'extendsTo',
            model: model,
            reverse_name: ''
        }

        return model
    }

    /* associatations about :end */

    [extraMembers: string]: any
}

export default ClassORMModel

interface ModelClassOptions {
    db: FxORM
    settings: ORMSettings
    driver_name: string
    driver: ORMConnDriver
    table: string
    properties: ModelDefinitionPropertyHash
    extension
    indexes: string[]
    identityCache
    keys: ModelIdType | ModelIdType[]

    autoSave: boolean
    autoFetch: boolean
    autoFetchLimit: number
    cascadeRemove: boolean

    hooks: ModelHooks
    methods: {[fnName: string]: Function}
    validations: {[fnName: string]: Function}
}
export function ModelClass (opts: ModelClassOptions): void {
    const model: ClassORMModel = function () {
        const _model = ClassORMModel.call(this, opts.table, opts.properties)
    } as any
    
    // return model;
    return model as any
}