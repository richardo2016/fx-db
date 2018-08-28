Object.defineProperty(exports, "__esModule", { value: true });
function noop() { }
class ClassORMValidators {
    constructor(validationFn = noop) {
        this._validationFn = noop;
        this._validators = [];
        this._validationFn = validationFn;
    }
    static rangeNumber(min, max) {
        return new ClassORMValidators((value) => {
            return value <= min && max >= value;
        });
    }
    validate(_value) {
        return this._validationFn(_value);
    }
}
exports.default = ClassORMValidators;
