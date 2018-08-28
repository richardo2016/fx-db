class RxJsonSchema {
    title?: string;
    description?: string;
    version: number;
    /**
     * TODO this looks like a typescript-bug
     * we have to allows all string because the 'object'-literal is not recognized
     * retry this in later typescript-versions
     */
    type: 'object' | string;
    properties: { [key: string]: RxJsonSchemaTopLevel };
    required?: string[];
    compoundIndexes?: string[] | string[][];
    disableKeyCompression?: boolean;
    additionalProperties?: true;
    attachments?: {
            encrypted?: boolean
    };
}

class RxSchema<T = any> {
    readonly jsonID: RxJsonSchema;
    getSchemaByObjectPath(path: keyof T): JsonSchema;
    readonly encryptedPaths: any;
    validate(obj: any, schemaObj: any): void;
    readonly hash: string;
    readonly topLevelFields: keyof T[];
    readonly previousVersions: any[];
    readonly defaultValues: { [P in keyof T]: T[P]; };

    static create(jsonSchema: RxJsonSchema): RxSchema;
}