class RxChangeEventDataBase {
    readonly op: RxChangeEventOperation;
    readonly t: number;
    readonly db: string;
    readonly it: string;
    readonly isLocal: boolean;
}

declare class RxChangeEventBase {
    isIntern(): boolean;
    isSocket(): boolean;
    readonly hash: string;
}

// INSERT
class RxChangeEventInsertData<RxDocumentType> extends RxChangeEventDataBase {
    readonly op: 'INSERT';
    readonly col: string;
    readonly doc: string;
    readonly v: RxEventValue<RxDocumentType>;
}

declare class RxChangeEventInsert<RxDocumentType> extends RxChangeEventBase {
    readonly data: RxChangeEventInsertData<RxDocumentType>;
    toJSON(): RxChangeEventInsertData<RxDocumentType>;
}
// UPDATE
class RxChangeEventUpdateData<RxDocumentType> extends RxChangeEventDataBase {
    readonly op: 'UPDATE';
    readonly col: string;
    readonly doc: string;
    readonly v: RxEventValue<RxDocumentType>;
}

declare class RxChangeEventUpdate<RxDocumentType> extends RxChangeEventBase {
    readonly data: RxChangeEventUpdateData<RxDocumentType>;
    toJSON(): RxChangeEventUpdateData<RxDocumentType>;
}

// REMOVE
class RxChangeEventRemoveData<RxDocumentType> extends RxChangeEventDataBase {
    readonly op: 'REMOVE';
    readonly col: string;
    readonly doc: string;
    readonly v: RxEventValue<RxDocumentType> | RemoveData;
}

declare class RxChangeEventRemove<RxDocumentType> extends RxChangeEventBase {
    readonly data: RxChangeEventRemoveData<RxDocumentType>;
    toJSON(): RxChangeEventRemoveData<RxDocumentType>;
}

// COLLECTION
class RxChangeEventCollectionData extends RxChangeEventDataBase {
    readonly op: 'RxDatabase.collection';
}

declare class RxChangeEventCollection extends RxChangeEventBase {
    readonly data: RxChangeEventCollectionData;
    toJSON(): RxChangeEventCollectionData;
}