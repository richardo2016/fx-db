import events = require('events')

interface ORMSettings { }

interface ORMDefineModelOptions {
    driver_name: ORMDriverNameType
}

type ORMDriverNameType = 'mysql' | 'mssql' | 'sqlite'

interface ORMConnDriver {
    // dialog type
    dialect: string;
    propertyToValue: Function;
    valueToProperty: Function;
    insert: Function;
    db: {
        conn: ConnInstanceInOrmConnDriverDB
    }

    execQuerySync: (query: SqlQueryType, opt: OrigOrmExecQueryOpts) => any

}

interface FxORM {
    models: { [key: string]: Model };

    use(plugin: string, options?: any): FxORM;
    use(plugin: Plugin, options?: any): FxORM;

    define(name: string, properties: ModelDefinitionPropertyHash, opts?: ModelOptions): Model;
    ping(callback: FxCommonErrHandler): FxORM;
    close(callback: FxCommonErrHandler): FxORM;
    closeSync(): FxORM;
    load(file: string, callback: FxCommonErrHandler): any;
    loadSync(file: string): any;
    sync(callback: FxCommonErrHandler): FxORM;
    syncSync(): FxORM;
    drop(callback: FxCommonErrHandler): FxORM;
    dropSync(): FxORM;

    driver: ORMConnDriver
    begin (): any
    commit (): any
    rollback (): any
    trans (func: Function): any
}

interface ORM_ErrorEmitter extends events.EventEmitter {

}