type ModelIdType = string | number

interface Property { }

type ModelPropertyInternalType = 'text' | 'number' | 'integer' | 'boolean' | 'date' | 'serial' | 'object' | 'binary' /*  | 'enum' */
interface ModelProperty extends Property {
    type: ModelPropertyInternalType | string
    unique?: boolean
    defaultValue?: any

    unsigned?: boolean
    // size?: number
    values?: any[]

    time?: boolean

    big?: boolean
}

type ModelDefinitionProperty = ModelProperty |
    String | Boolean | Number | Date | object | Class_Buffer | any[]
interface ModelDefinitionPropertyHash {
    [key: string]: ModelDefinitionProperty
}

interface ModelIntergratedProperty extends ModelProperty {
    model: Model
    field_name: string
}

interface ModelIntergratedPropertyHash {
    [key: string]: ModelIntergratedProperty
}

interface ModelPropertyHash {
    [propertyName: string]: ModelProperty
}

interface ModelDefinitionOptsHash extends ModelOptions {
    id?: string[];
    autoFetch?: boolean;
    autoFetchLimit?: number;
    cacheFetch?: boolean;
    hooks?: { [property: string]: ModelHooks };
    methods?: { [name: string]: Function };

    table: string
    collection: string // alias of table
    
    extension
    // fields to build index
    indexes: string[]
    identityCache
    autoSave: boolean
    cascadeRemove: boolean
    validations: { [property: string]: Function };
}

interface ORMModelSettings extends ORMSettings {
}

interface ModelFunctionErrHandler {
    (err: Error): void
}

interface ModelFindOptions {
    limit?: number
    order?: any
}
type ModelAssociationType = 'hasOne' | 'hasMany' | 'extendsTo'
interface Model extends ModelAndInstanceCommonQueryOperation {
    // (): ModelInstance;
    // (...ids: any[]): ModelInstance;


    table: string;
    id: string[];
    properties: ModelPropertyHash;
    readonly allProperties: ModelPropertyHash;
    settings: ORMModelSettings;

    name: string;
    // model_name: string;

    drop(callback?: ModelFunctionErrHandler): Model;
    sync(callback?: ModelFunctionErrHandler): Model;

    get(...args: any[]): ModelInstance;
    find(conditions: object, callback: ModelInstanceFindCallback): ModelInstance;
    find(conditions: object, options: ModelFindOptions, callback: ModelInstanceFindCallback): ModelInstance;
    find(conditions: object, limit: number, order: string[], callback: ModelInstanceFindCallback): ModelInstance;
    find(conditions: object): ModelInstance/* IChainFind */;
    all(conditions: object, callback: ModelInstanceFindCallback): ModelInstance;
    all(conditions: object, options: ModelFindOptions, callback: ModelInstanceFindCallback): ModelInstance;
    all(conditions: object, limit: number, order: string[], callback: ModelInstanceFindCallback): ModelInstance;
    one(conditions: object, callback: (err: Error, result: ModelInstance) => void): ModelInstance;
    one(conditions: object, options: ModelFindOptions, callback: (err: Error, result: ModelInstance) => void): ModelInstance;
    one(conditions: object, limit: number, order: string[], callback: (err: Error, result: ModelInstance) => void): ModelInstance;
    count(callback: ModelCountCallback): ModelInstance;
    count(conditions: object, callback: ModelCountCallback): ModelInstance;
    exists(id: any, callback: (err: Error, exists: boolean) => void): ModelInstance;
    exists(...args: any[]): ModelInstance;

    create(data: object, callback: ModelCreateOrGetCallback): ModelInstance;
    create(...args: any[]): ModelInstance;

    aggregate(conditions: object): IAggregated;
    aggregate(properties: string[]): IAggregated;
    aggregate(conditions: object, properties: string[]): IAggregated;

    clear(): Model;

    hasOne: (...args: any[]) => any;
    hasMany: (...args: any[]) => any;
    extendsTo: (...args: any[]) => Model;
    extends: ModelAssociatedModelHash;
    readonly __associations: ModelAssociatedModelHash;

    [property: string]: any;
}

interface ModelCountCallback {
    callback: (err: Error, count: number) => void
}

interface ModelCreateOrGetCallback {
    callback: (err: Error, instance: ModelInstance) => void
}

interface ModelAssociatedModelHash { [extendModel: string]: ModelAssociationConfiguration }

type ModelDynamicMountedMehotdActionType = 'set' | 'get'
interface ModelAssociationInitOptions {
    reverse?: string;
}

interface ModelAssociationInitOptions__HasOne extends ModelAssociationInitOptions {
    required?: boolean;
    alwaysValidate?: boolean;
    autoFetch?: boolean;
}
interface ModelAssociationInitOptions__HasMany extends ModelAssociationInitOptions {
    // whether use primary-key in relational table
    key?: boolean;
}

interface ModelInstanceAssociationItem {
    name: string;
    field: ModelProperty
    getAccessor: string;
    setAccessor: string;
    hasAccessor: string;
    delAccessor: string;
    addAccessor: string;
}

interface ModelAssociationConfiguration {
    name: string

    type: ModelAssociationType;
    model: Model;

    // whether the model is the one **associated**
    reversed?: boolean;
    reverse_name?: string;
}

interface ModelInstance extends ModelAndInstanceCommonQueryOperation {
    isInstance(): boolean;
    isPersisted(): boolean;
    isShell(): boolean;
    validate(callback: (errors: Error[]) => void);
    model: Model;

    on(event: string, callback): ModelInstance;
    save(): ModelInstance;
    save(data: object, callback: FxCommonErrHandler): ModelInstance;
    save(data: object, options: any, callback: FxCommonErrHandler): ModelInstance;
    saved: boolean;
    remove(callback: FxCommonErrHandler): ModelInstance;
    removeSync(): ModelInstance;

    /* missing fix: start */
    set: Function;
    markAsDirty: Function;
    dirtyProperties: object;
    __singleton_uid: string | number;
    readonly __opts: ModelInstanceOptions;

    /* missing fix: end */

    [property: string]: any;
}

interface ModelInstanceInitOptions {
    model: Model
}

interface ModelInstanceFindCallback {
    (err: Error, results: ModelInstance[]): void
}

interface ModelInstanceOptions extends ModelOptions, ModelInstanceInitOptions {
    one_associations: ModelInstanceAssociationItem[]
    many_associations: ModelInstanceAssociationItem[]
    extend_associations: ModelInstanceAssociationItem[]
    association_properties: any
    fieldToPropertyMap: any
}

interface ModelInstanceSaveOptions {

}

interface IChainFind {
    find(conditions: object): IChainFind;
    only(...args: string[]): IChainFind;
    limit(limit: number): IChainFind;
    offset(offset: number): IChainFind;
    run(callback: ModelInstanceFindCallback): void;
    count(callback: ModelCountCallback): void;
    remove(callback: FxCommonErrHandler): void;
    save(callback: FxCommonErrHandler): void;
    each(callback: (result: ModelInstance) => void): void;
    each(): IChainFind;
    filter(callback: (result: ModelInstance) => boolean): IChainFind;
    sort(callback: (a: ModelInstance, b: ModelInstance) => boolean): IChainFind;
    get(callback: (results: ModelInstance[]) => void): IChainFind;
}
interface ModelAndInstanceCommonQueryOperation {
    countSync: Function;
    firstSync: Function;
    lastSync: Function;
    allSync: Function;
    whereSync: Function;
    findSync: Function;
    runSync: Function;
}

// interface IChainFxORMFind extends ModelAndInstanceCommonQueryOperation, SelectQuery {
//     only(args: string | string[]): IChainFxORMFind;
//     only(...args: string[]): IChainFxORMFind;
//     order(...order: string[]): IChainFxORMFind;
// }

interface IAggregated {
    groupBy(...columns: string[]): IAggregated;
    limit(limit: number): IAggregated;
    limit(offset: number, limit: number): IAggregated;
    order(...order: string[]): IAggregated;
    select(columns: string[]): IAggregated;
    select(...columns: string[]): IAggregated;
    as(alias: string): IAggregated;
    call(fun: string, args: any[]): IAggregated;
    get(callback: ModelCreateOrGetCallback);
}

interface ModelOptions {
    id?: string[];
    autoFetch?: boolean;
    autoFetchLimit?: number;
    cacheFetch?: boolean;
    hooks?: { [property: string]: ModelHooks };
    methods?: { [name: string]: Function };

    [extensibleProperty: string]: any;
}

interface ModelHooks {
    beforeValidation?: (next?: Function) => void;
    beforeCreate?: (next?: Function) => void;
    afterCreate?: (next?: Function) => void;
    beforeSave?: (next?: Function) => void;
    afterSave?: (next?: Function) => void;
    afterLoad?: (next?: Function) => void;
    afterAutoFetch?: (next?: Function) => void;
    beforeRemove?: (next?: Function) => void;
    afterRemove?: (next?: Function) => void;
}

interface IConnectionOptions {
    protocol: string;
    host?: string;
    port?: number;
    auth?: string;
    username?: string;
    password?: string;
    database?: string;
    pool?: boolean;
    debug?: boolean;
}

interface FxCommonErrHandler {
    (err: Error): void
}