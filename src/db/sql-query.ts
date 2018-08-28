/// <reference path="../../@types/index.d.ts" />

export default class SqlQuery {
    constructor(options: SqlQueryOptions) {

    };

    static Text(type: string): TextQuery {
        return null;
    };

    static Comparators: string[];
    static between(a: number, b: number): Comparator {
        return null;
    };
    static not_between(a: number, b: number): Comparator {
        return null;
    };
    static like(expression: string): Comparator {
        return null
    };
    static eq(value: any): Comparator {
        return null
    };
    static ne(value: any): Comparator {
        return null
    };
    static gt(value: any): Comparator {
        return null
    };
    static gte(value: any): Comparator {
        return null
    };
    static lt(value: any): Comparator {
        return null
    };
    static lte(value: any): Comparator {
        return null
    };

    escapeId(id: string, table?: string): string {
        return '';
    };
    escapeVal(value: any): string {
        return ''
    };
    select(): SelectQuery {
        return null;
    };
    insert(): InsertQuery {
        return null;
    };
    update(): UpdateQuery {
        return null;
    };
    remove(): RemoveQuery {
        return null;
    };
}