Object.defineProperty(exports, "__esModule", { value: true });
const aliases = require('../drivers/aliases');
const adapters = {};
function add(name, constructor) {
    adapters[name] = constructor;
}
exports.add = add;
;
function get(name) {
    if (name in aliases) {
        return get(aliases[name]);
    }
    else if (!(name in adapters)) {
        adapters[name] = require("../drivers/dml/" + name).Driver;
    }
    return adapters[name];
}
exports.get = get;
