type RxChangeEventOperation =
    'INSERT' | // document created
    'UPDATE' | // document changed
    'REMOVE' | // document removed
    'RxDatabase.collection'; // collection created

type RemoveData = {
    _id: string,
    _rev: string,
    _deleted: true
};

type RxEventValueWithRevAndId = {
    _id: string;
    _rev: string;
};
type RxEventValue<RxDocumentType> = RxDocumentType & RxEventValueWithRevAndId;