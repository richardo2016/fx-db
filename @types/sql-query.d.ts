interface SqlQueryType {

}

interface SqlQueryOptions {
    dialect: string;
}

interface Comparator {
    sql_comparator(): string;
    from?: any;
    to?: any;
    expr?: string;
    value?: any;
}

interface TextQuery {
    data: any;
    type: string;
}

interface SelectQuery {
    select(fields: string): SelectQuery;
    calculateFoundRows: SelectQuery;
    as(alias: string): SelectQuery;
    fun(fun: string, column: string, alias: string): SelectQuery;
    from(table: string, from_id: string, to_id: string): SelectQuery;
    from(table: string, from_id: string, to_table: string, to_id: string): SelectQuery;
    where(...args: any[]): SelectQuery;
    whereExists(table: string, table_link: string, link: string, conditions: { [column: string]: any }): SelectQuery;
    groupBy(...columns: string[]): SelectQuery;
    offset(offset: number): SelectQuery;
    limit(limit: number): SelectQuery;
    order(column: string, direction: string): SelectQuery;
    build(): string;
}

interface InsertQuery {
    into(table: string): InsertQuery;
    set(values: { [key: string]: any }[]): InsertQuery;
    build(): string;
}

interface UpdateQuery {
    into(table: string): UpdateQuery;
    set(values: { [column: string]: any }): UpdateQuery;
    where(...conditions: { [column: string]: any }[]): UpdateQuery;
    build(): string;
}

interface RemoveQuery {
    from(table: string): RemoveQuery;
    where(...conditions: { [column: string]: any }[]): RemoveQuery;
    build(): string;
}