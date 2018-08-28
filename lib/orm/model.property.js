Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ClassORMModelPropertyManger
 *
 */
class ClassORMModelPropertyManger {
    constructor(model, properties) {
        if (!properties || typeof properties !== 'object')
            throw `${''}typed properties required`;
        Object.keys(properties).forEach(propName => {
            this[propName] = normalizePropertyType(propName, properties[propName], model);
        });
    }
    static normalize(property, settings) {
    }
    ;
    static validate(value, property) {
    }
    ;
}
ClassORMModelPropertyManger.normalizePropertyType = normalizePropertyType;
exports.default = ClassORMModelPropertyManger;
const internalPropertyTypes = [
    'binary',
    'boolean',
    'date',
    'integer',
    'number',
    'serial',
    'text',
    'object'
];
function normalizeTypedPropertyConfig(toNormalizeObj, type) {
    switch (type) {
        case 'text':
            toNormalizeObj.type = 'text';
            break;
        case 'number':
            toNormalizeObj.type = 'number';
            break;
        case 'boolean':
            toNormalizeObj.type = 'boolean';
            break;
        case 'binary':
            toNormalizeObj.type = 'binary';
            break;
        case 'date':
            toNormalizeObj.type = 'date';
            break;
    }
}
function normalizePropertyType(field_name, defProp, model) {
    // ModelProperty | String | Boolean | Number | Date | Object | Class_Buffer | any[]
    const normalizedProp = {
        field_name: field_name,
        model: model,
        type: 'unknown'
    };
    let _type = typeof defProp;
    switch (_type) {
        case 'function':
            if (defProp === String) {
                normalizeTypedPropertyConfig(normalizedProp, 'text');
            }
            else if (defProp === Number) {
                normalizeTypedPropertyConfig(normalizedProp, 'number');
            }
            else if (defProp === Boolean) {
                normalizeTypedPropertyConfig(normalizedProp, 'boolean');
            }
            else if (defProp === Buffer) {
                normalizeTypedPropertyConfig(normalizedProp, 'binary');
            }
            else if (defProp === Date) {
                normalizeTypedPropertyConfig(normalizedProp, 'date');
            }
            break;
        case 'object':
            normalizedProp.type = defProp.type;
            normalizedProp.defaultValue = defProp.defaultValue;
            break;
        case 'string':
            normalizeTypedPropertyConfig(normalizedProp, 'text');
            break;
        case 'number':
            normalizeTypedPropertyConfig(normalizedProp, 'number');
            break;
        case 'boolean':
            normalizeTypedPropertyConfig(normalizedProp, 'boolean');
            break;
        default:
            throw 'invalid definition-property';
    }
    // check type
    if (!~internalPropertyTypes.indexOf(normalizedProp.type)) {
        throw `invalid property type ${normalizedProp.type}`;
    }
    // normalize side options
    normalizedProp.unique = !!normalizedProp.unique;
    normalizedProp.unsigned = !!normalizedProp.unsigned;
    normalizedProp.big = !!normalizedProp.big;
    // final check
    switch (normalizedProp.type) {
        case 'text':
            break;
        case 'number':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = Math.abs(normalizedProp.defaultValue);
            }
            break;
        case 'serial':
            normalizedProp.unique = true;
            normalizedProp.unsigned = true;
        case 'integer':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = Math.abs(normalizedProp.defaultValue);
            }
            normalizedProp.defaultValue = parseInt(normalizedProp.defaultValue || 0);
            if (isNaN(normalizedProp.defaultValue))
                throw `invalid defaultValue for property ${normalizedProp.field_name}`;
            break;
        case 'boolean':
            if (normalizedProp.unsigned) {
                normalizedProp.defaultValue = !!normalizedProp.defaultValue;
            }
            break;
        case 'date':
            break;
        case 'binary':
            break;
    }
    return normalizedProp;
}
