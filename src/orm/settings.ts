/**
 * ClassORMSettings
 * 
 * | valid setting | type |
 * | --- | --- |
 * | instance.returnAllErrors | boolean |
 * 
 */
type SettingValueType = number | string

export default class ClassORMSettings implements ORMSettings {
    _kvs: object = {};

    constructor (initKvs: ORMSettings) {
        this._kvs = {...initKvs}
    }

    set (k: string, v: SettingValueType) {
        if (v === undefined)
            throw `${''}value is required for ClassORMSettings::set`
        
        this._kvs[k] = v
    }

    get (k) {
        return this._kvs[k]
    }
}