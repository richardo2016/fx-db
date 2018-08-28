Object.defineProperty(exports, "__esModule", { value: true });
class ClassORMSettings {
    constructor(initKvs) {
        this._kvs = {};
        this._kvs = Object.assign({}, initKvs);
    }
    set(k, v) {
        if (v === undefined)
            throw `${''}value is required for ClassORMSettings::set`;
        this._kvs[k] = v;
    }
    get(k) {
        return this._kvs[k];
    }
}
exports.default = ClassORMSettings;
