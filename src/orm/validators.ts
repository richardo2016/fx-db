/**
 * ClassORMValidators
 * 
 */
interface ValidationFn {
    (...args): void
}

function noop() {}

export default class ClassORMValidators {
    _validationFn: ValidationFn = noop;
    _validators: any[] = [];
    
    static rangeNumber (min: number, max: number) {
        return new ClassORMValidators((value) => {
            return value <= min && max >= value
        });
    }

    constructor (validationFn: ValidationFn = noop) {
        this._validationFn = validationFn
    }

    validate (_value: any) {
        return this._validationFn(_value)
    }
}