interface OrigOrmExecQueryOpts {
    [key: string]: any;
}

interface ConnInstanceInOrmConnDriverDB {
    begin(): void;
    close(): void;
    commit(): void;
    rollback(): void;
    trans(func: Function): boolean
    execute(sql: string, ...args: any[]): any[];
}