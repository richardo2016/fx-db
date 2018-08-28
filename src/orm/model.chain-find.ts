/**
 * ClassORMModelChainFind
 * 
 */

export default class ClassORMModelChainFind implements IChainFind {
    _model: Model = null
    
    constructor (model: Model) {
        this._model = model
    }
    
    /* IChainFind specified :start */
    find(conditions: { [property: string]: any }): IChainFind {
        return this
    };

    only(...args: string[]): IChainFind {
        return this
    };
    limit(limit: number): IChainFind {
        return this
    };
    offset(offset: number): IChainFind {
        return this
    };
    run(callback: (err: Error, results: ModelInstance[]) => void): void {
        
    };
    count(callback: (err: Error, count: number) => void): void {
        
    };
    remove(callback: (err: Error) => void): void {

    };
    save(callback: (err: Error) => void): void {

    };
    each(callback?: (result: ModelInstance) => void): any {
        const result = null
        if (!callback) {
            return this
        }

        callback(result)
    };
    // each(): IChainFind {};
    filter(callback: (result: ModelInstance) => boolean): IChainFind {
        return this;

    };
    sort(callback: (a: ModelInstance, b: ModelInstance) => boolean): IChainFind {
        return this;
    };
    get(callback: (results: ModelInstance[]) => void): IChainFind {
        return this;
    };
    /* IChainFind specified :end */
}