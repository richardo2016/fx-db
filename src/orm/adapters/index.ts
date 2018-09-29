import aliases = require('../drivers/aliases');
const adapters = {};

export function add (name: string, constructor: Function) {
  adapters[name] = constructor;
};
export function get(name: string) {
  if (name in aliases) {
    return get(aliases[name]);
  } else if (!adapters.hasOwnProperty(name)) {
    adapters[name] = require("../drivers/dml/" + name).Driver;
  }

  return adapters[name];
}





