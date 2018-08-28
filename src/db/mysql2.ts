/// <reference path="../../@types/index.d.ts" />

import db = require('db');
import events = require('events');
import util = require('util');
import url = require('url');

class Database extends events.EventEmitter {
    opts: string/* MysqlDBOpts */;
    conn: Class_DbConnection;
    
    constructor(connOpts: string | MysqlDBOpts) {
        super();
        if (typeof connOpts === 'string') {
            this.opts = connOpts;
        } else {
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

        (db.openMySQL as Function)(this.opts, (e, conn) => {
            if (!e) {
                this.conn = conn;
                this.emit('connect', conn);
            } else
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
        (this.conn.close as Function)(cb);
    }
}

exports.createConnection = function (connOpts) {
    return new Database(connOpts);
};