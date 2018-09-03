/// <reference path="sql-query.d.ts" />
/// <reference path="db-connection.d.ts" />
/// <reference path="mysql.d.ts" />
/// <reference path="model.d.ts" />
/// <reference path="orm.d.ts" />

declare module "events" {
    export const EventEmitter: typeof Class_EventEmitter
}

declare module "fib-db" {
    interface FibDBModule {
        
    }

    export = FibDBModule
}
