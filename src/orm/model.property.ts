import ClassORMModel from "./model";

/**
 * ClassORMModelPropertyManger
 * 
 */

export default class ClassORMModelPropertyManger {
    model: ClassORMModel;
    field_name: string;

    _props: ModelIntergratedPropertyHash

    static normalize (property: string, settings: ORMSettings): any {

    };
    
    static validate (value: any, property: string): any {

    };

    static normalizePropertyType = normalizePropertyType;

    constructor (model: Model, properties: ModelDefinitionPropertyHash) {
        if (!properties || typeof properties !== 'object')
            throw `${''}typed properties required`
        
        Object.keys(properties).forEach(propName => {
            this[propName] = normalizePropertyType(propName, properties[propName], model)
        })
    }
}

const internalPropertyTypes: ModelPropertyInternalType[] = [
    'binary',
    'boolean',
    'date',
    'integer',
    'number',
    'serial',
    'text',
    'object'
]

function normalizeTypedPropertyConfig (toNormalizeObj: ModelIntergratedProperty, type: ModelPropertyInternalType) {
    switch (type) {
        case 'text':
            toNormalizeObj.type = 'text' as ModelPropertyInternalType
            break
        case 'number':
            toNormalizeObj.type = 'number' as ModelPropertyInternalType
            break
        case 'boolean':
            toNormalizeObj.type = 'boolean' as ModelPropertyInternalType
            break
        case 'binary':
            toNormalizeObj.type = 'binary' as ModelPropertyInternalType
            break
        case 'date':
            toNormalizeObj.type = 'date' as ModelPropertyInternalType
            break
    }
}

function normalizePropertyType (field_name: string, defProp: ModelDefinitionProperty, model: Model): ModelIntergratedProperty {
    // ModelProperty | String | Boolean | Number | Date | Object | Class_Buffer | any[]
    const normalizedProp: ModelIntergratedProperty = {
        field_name: field_name,
        model: model,
        type: 'unknown'
    }

    let _type = typeof defProp
    
    switch (_type) {
        case 'function':
            if (defProp === String) {
                normalizeTypedPropertyConfig(normalizedProp, 'text')
            } else if (defProp === Number) {
                normalizeTypedPropertyConfig(normalizedProp, 'number')
            } else if (defProp === Boolean) {
                normalizeTypedPropertyConfig(normalizedProp, 'boolean')
            } else if (defProp === Buffer) {
                normalizeTypedPropertyConfig(normalizedProp, 'binary')
            } else if (defProp === Date) {
                normalizeTypedPropertyConfig(normalizedProp, 'date')
            }
            break
        case 'object':
            normalizedProp.type = (defProp as any).type
            normalizedProp.defaultValue = (defProp as any).defaultValue
            break
        case 'string':
            normalizeTypedPropertyConfig(normalizedProp, 'text')
            break
        case 'number':
            normalizeTypedPropertyConfig(normalizedProp, 'number')
            break
        case 'boolean':
            normalizeTypedPropertyConfig(normalizedProp, 'boolean')
            break
        default:
            throw 'invalid definition-property'
    }

    // check type
    if (!~internalPropertyTypes.indexOf(
        normalizedProp.type as ModelPropertyInternalType
    )) {
        throw `invalid property type ${normalizedProp.type}`
    }

    // normalize side options
    normalizedProp.unique = !!normalizedProp.unique
    normalizedProp.unsigned = !!normalizedProp.unsigned
    normalizedProp.big = !!normalizedProp.big

    // final check
    switch (normalizedProp.type) {
        case 'text':
            break
        case 'number':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = Math.abs(normalizedProp.defaultValue)
            }
            break
        case 'serial':
            normalizedProp.unique = true
            normalizedProp.unsigned = true
        case 'integer':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = Math.abs(normalizedProp.defaultValue)
            }
            normalizedProp.defaultValue = parseInt(normalizedProp.defaultValue || 0)
            if (isNaN(normalizedProp.defaultValue))
                throw `invalid defaultValue for property ${normalizedProp.field_name}`
            break
        case 'boolean':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = !!normalizedProp.defaultValue
            }
            break
        case 'date':
            break
        case 'binary':
            break
    }

    return normalizedProp
}