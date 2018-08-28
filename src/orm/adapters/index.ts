const aliases = require('./Drivers/aliases');
const adapters = {};

export function add (name, constructor) {
  adapters[name] = constructor;
};
export function get(name) {
  if (name in aliases) {
    return get(aliases[name]);
  } else if (!(name in adapters)) {
    adapters[name] = require("../drivers/dml/" + name).Driver;
  }

  return adapters[name];
}





