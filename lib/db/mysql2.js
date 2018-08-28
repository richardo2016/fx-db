/// <reference path="../../@types/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("db");
const events = require("events");
const util = require("util");
const url = require("url");
class Database extends events.EventEmitter {
    constructor(connOpts) {
        super();
        if (typeof connOpts === 'string') {
            this.opts = connOpts;
        }
        else {
            this.opts = url.format({
                protocol: "mysql",
                slashes: "/",
                username: connOpts.user,
                password: connOpts.password,
                hostname: connOpts.host,
                port: connOpts.port,
                pathname: connOpts.database
            });
        }
        db.openMySQL(this.opts, (e, conn) => {
            if (!e) {
                this.conn = conn;
                this.emit('connect', conn);
            }
            else
                this.emit('error', e);
        });
    }
    query(sql, cb) {
        if (!util.isString(sql))
            sql = sql.sql;
        this.conn.execute(sql, cb);
        return this;
    }
    end(cb) {
        this.conn.close(cb);
    }
}
exports.createConnection = function (connOpts) {
    return new Database(connOpts);
};
