import { buildAssociationMethodName, getModelExtendModelHash } from './_utils'
import ClassORMModel from './model';

/**
 * ClassORMModelInstance
 * 
 */

class ClassORMModelInstance implements ModelInstance {
    saved: boolean;

    isInstance(): boolean {
        return false
    };
    isPersisted(): boolean {
        return false
    };
    isShell(): boolean {
        return false
    };
    model: Model;

    // _kvs: ProxyHandler<object> = {};
    _kvs: object = {};

    __singleton_uid: string | number;

    readonly __opts: ModelInstanceOptions = {
        model: null,

        one_associations: [],
        many_associations: [],
        extend_associations: [],
        association_properties: null,
        fieldToPropertyMap: null
    };

    constructor (fields: object, options: ModelInstanceInitOptions) {
        if (!options.model || !(options.model instanceof ClassORMModel))
            throw `typed-model is required`

        this.__opts.model = options.model

        _initializeFrom__Opts.call(this)

        Object.keys(fields).forEach(k => {
            this._kvs[k] = fields[k];
        })
    }

    /**
     * 
     * @param event register one event
     * @param callback 
     */
    on (event: string, callback): ModelInstance {
        
        return null
    };

    firstSync (...args: any[]): ModelInstance { return this.__opts.model.firstSync(...args) }
    lastSync (...args: any[]): ModelInstance { return this.__opts.model.lastSync(...args) }
    countSync (...args: any[]): ModelInstance { return this.__opts.model.countSync(...args) }
    allSync (...args: any[]): ModelInstance { return this.__opts.model.allSync(...args) }
    whereSync (...args: any[]): ModelInstance { return this.__opts.model.whereSync(...args) }
    findSync (...args: any[]): ModelInstance { return this.__opts.model.findSync(...args) }
    runSync (...args: any[]): ModelInstance { return this.__opts.model.runSync(...args) }

    /**
     * save instance
     */
    // save(): ModelInstance {
    //     return null;
    // };
    // save(data: object, callback: ModelFunctionErrHandler): ModelInstance {
    //     return null
    // };
    save (data?: object, options?: ModelInstanceSaveOptions, callback?: ModelFunctionErrHandler): ModelInstance {
        return this
    };

    saveSync (data?: object, options?: ModelInstanceSaveOptions, callback?: ModelFunctionErrHandler): ModelInstance {
        return this.save(data, options, callback)
    };

    remove (callback: ModelFunctionErrHandler): ModelInstance {
        return this
    }
    /**
     * remove row data list from table
     */
    removeSync (): ModelInstance {
        return this
    }

    set (field_name: string, field_value: any) {
        this._kvs[field_name] = field_value
    }

    dirtyProperties: object;
    markAsDirty (field_name: string, field_value: any) {
        this.dirtyProperties[field_name] = true
    }

    validate (callback: (errors: Error[]) => void) {

    }
}

function _initializeFrom__Opts (this: ClassORMModelInstance) {
    const _extends = getModelExtendModelHash(this.__opts.model);
    Object.keys(_extends).forEach(extendName => {
        const associationConfig = _extends[extendName]

        switch (associationConfig.type) {
            case 'hasOne':
                this.__opts.one_associations.push(
                    buildModelInstanceAssociationItem(associationConfig, 'hasOne')
                )
                break
            case 'hasMany':
                this.__opts.one_associations.push(
                    buildModelInstanceAssociationItem(associationConfig, 'hasMany')
                )
                break
            case 'extendsTo':
                break
        }
    })

    this.__opts.one_associations.forEach(association => {
        this[association.getAccessor] = function () {};
        this[association.setAccessor] = function () {};
    })

    this.__opts.many_associations.forEach(association => {
        this[association.getAccessor] = function () {};
        this[association.setAccessor] = function () {};
    })
}

function buildModelInstanceAssociationItem (associationConfig: ModelAssociationConfiguration, assocType: ModelAssociationType): ModelInstanceAssociationItem {
    return {
        name: associationConfig.name,
        // TODO: ?
        field: null,
        getAccessor: buildAssociationMethodName('get', associationConfig.name, assocType),
        setAccessor: buildAssociationMethodName('set', associationConfig.name, assocType),
        hasAccessor: '',
        delAccessor: '',
        addAccessor: ''
    }
}

export default ClassORMModelInstance