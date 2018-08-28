/// <reference path="../../@types/index.d.ts" />

import events = require('events')
import url = require('url')

import ClassORMSettings from './settings';
import ClassORMValidators from './validators';
import { default as ClassORMModel, ModelClass } from './model';

class ORM extends events.EventEmitter implements FxORM {
    /* static methods && variables :start */
    static validators = ClassORMValidators;

    /**
     * connect one databse backend, get one ORM instance
     * @param connString 
     */
    static connectSync (connString: string) {
        return new ORM()
    }

    static parseConnectString (connString: string) {
        return url.parse('mysql://root:root@localhost:3306/rx-db')
    }
    /* static methods && variables :end */

    settings: ClassORMSettings
    driver_name: ORMDriverNameType
    driver: ORMConnDriver

    models: { [modelName: string]: Model } = {}

    constructor () {
        super()
        this.settings = new ClassORMSettings({})

        this.driver_name = 'mysql'
    }

    use (plugin: Plugin|string, options?: any): FxORM {
        return this
    }

    ping(callback: FxCommonErrHandler): FxORM {
        return this
    }

    close(callback: FxCommonErrHandler): FxORM {
        return this
    }

    closeSync(): FxORM {
        return this
    }

    load(file: string, callback: FxCommonErrHandler): any {
        
    }

    loadSync(file: string): any {
        
    }

    sync(callback: FxCommonErrHandler): FxORM {
        return this
    }

    syncSync(): FxORM {
        return this
    }

    drop(callback: FxCommonErrHandler): FxORM {
        return this
    }

    dropSync(): FxORM {
        return this
    }

    begin () {
        
    }
    commit () {
        
    }
    rollback () {
        
    }
    trans (func: Function) {

    }

    /**
     * define one model
     */
    define (modelName: string, properties: ModelDefinitionPropertyHash, opts?: ModelDefinitionOptsHash): Model {
        // return new ClassORMModel(modelName, properties)

        this.models[modelName] = new ModelClass({
            db             : this,
            settings       : this.settings,
            driver_name    : this.driver_name,
            driver         : this.driver,
            table          : opts.table || opts.collection || ((this.settings.get("model.namePrefix") || "") + modelName),
            properties     : properties,
            extension      : opts.extension || false,
            indexes        : opts.indexes || [],
            identityCache  : opts.hasOwnProperty('identityCache') ? opts.identityCache : this.settings.get("instance.identityCache"),
            keys           : opts.id,
            autoSave       : opts.hasOwnProperty('autoSave') ? opts.autoSave : this.settings.get("instance.autoSave"),
            autoFetch      : opts.hasOwnProperty('autoFetch') ? opts.autoFetch : this.settings.get("instance.autoFetch"),
            autoFetchLimit : opts.autoFetchLimit || this.settings.get("instance.autoFetchLimit"),
            cascadeRemove  : opts.hasOwnProperty('cascadeRemove') ? opts.cascadeRemove : this.settings.get("instance.cascadeRemove"),
            hooks          : opts.hooks || {},
            methods        : opts.methods || {},
            validations    : opts.validations || {}
        })

        return this.models[modelName]
    }
}

export default ORM