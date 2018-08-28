/**
 * ClassORMModelChainFind
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ClassORMModelChainFind {
    constructor(model) {
        this._model = null;
        this._model = model;
    }
    /* IChainFind specified :start */
    find(conditions) {
        return this;
    }
    ;
    only(...args) {
        return this;
    }
    ;
    limit(limit) {
        return this;
    }
    ;
    offset(offset) {
        return this;
    }
    ;
    run(callback) {
    }
    ;
    count(callback) {
    }
    ;
    remove(callback) {
    }
    ;
    save(callback) {
    }
    ;
    each(callback) {
        const result = null;
        if (!callback) {
            return this;
        }
        callback(result);
    }
    ;
    // each(): IChainFind {};
    filter(callback) {
        return this;
    }
    ;
    sort(callback) {
        return this;
    }
    ;
    get(callback) {
        return this;
    }
    ;
}
exports.default = ClassORMModelChainFind;
