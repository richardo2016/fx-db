Object.defineProperty(exports, "__esModule", { value: true });
const enforce = require("@fibjs/enforce");
const util = require("util");
exports.required = enforce.required;
exports.notEmptyString = enforce.notEmptyString;
exports.rangeNumber = enforce.ranges.number;
exports.rangeLength = enforce.ranges.length;
exports.insideList = enforce.lists.inside;
exports.outsideList = enforce.lists.outside;
exports.password = enforce.security.password;
exports.patterns = enforce.patterns;
/**
 * Check if a value is the same as a value
 * of another property (useful for password
 * checking).
 **/
function equalToProperty(name, msg) {
    return function (v, next) {
        if (v === this[name]) {
            return next();
        }
        return next(msg || 'not-equal-to-property');
    };
}
exports.equalToProperty = equalToProperty;
;
/**
 * Check if a property is unique in the collection.
 * This can take a while because a query has to be made against the Model.
 *
 * Due to the async nature of node, and concurrent web server environments,
 * an index on the database column is the only way to gurantee uniqueness.
 *
 * For sensibility's sake, undefined and null values are ignored for uniqueness
 * checks.
 *
 * Options:
 *   ignoreCase: for postgres; mysql ignores case by default.
 *   scope: (Array) scope uniqueness to listed properties
 **/
function unique() {
    let arg, k;
    let msg = null, opts = {};
    for (k in arguments) {
        arg = arguments[k];
        if (typeof arg === "string") {
            msg = arg;
        }
        else if (typeof arg === "object") {
            opts = arg;
        }
    }
    return function (v, next, ctx) {
        let s, scopeProp;
        if (typeof v === "undefined" || v === null) {
            return next();
        }
        //Cannot process on database engines which don't support SQL syntax
        if (!ctx.driver.isSql) {
            return next('not-supported');
        }
        const chain = ctx.model.find();
        const chainQuery = function (prop, value) {
            let query = null;
            if (opts.ignoreCase === true && ctx.model.properties[prop] && ctx.model.properties[prop].type === 'text') {
                query = util.format('LOWER(%s.%s) LIKE LOWER(?)', ctx.driver.query.escapeId(ctx.model.table), ctx.driver.query.escapeId(prop));
                chain.where(query, [value]);
            }
            else {
                query = {};
                query[prop] = value;
                chain.where(query);
            }
        };
        const handler = function (err, records) {
            if (err) {
                return next();
            }
            if (!records || records.length === 0) {
                return next();
            }
            if (records.length === 1 && records[0][ctx.model.id] === this[ctx.model.id]) {
                return next();
            }
            return next(msg || 'not-unique');
        }.bind(this);
        chainQuery(ctx.property, v);
        if (opts.scope) {
            for (s in opts.scope) {
                scopeProp = opts.scope[s];
                // In SQL unique index land, NULL values are not considered equal.
                if (typeof ctx.instance[scopeProp] == 'undefined' || ctx.instance[scopeProp] === null) {
                    return next();
                }
                chainQuery(scopeProp, ctx.instance[scopeProp]);
            }
        }
        chain.all(handler);
    };
}
exports.unique = unique;
;
