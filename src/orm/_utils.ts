function upperCaseFirstChar (str: string = '') {
    return str[0].toUpperCase() + str.substr(1)
}

export function buildAssociationMethodName (actionType: ModelDynamicMountedMehotdActionType, associationName: string, associationType: ModelAssociationType) {
    switch (associationType) {
        case 'hasOne':
            return `${actionType}${upperCaseFirstChar(associationName)}Sync`
        case 'hasMany':
            return `${actionType}${upperCaseFirstChar(associationName)}sSync`
    }
}

export function getModelExtendModelHash (model: Model): ModelAssociatedModelHash {
    if (!model.extends) return {}

    if (typeof model.extends !== 'object') {
        throw `invalid type of model ${model.name}'s extends`
    }
    
    return model.extends || {}
}

export function buildModelAssociationConfiguration (associationName: string, assocType: ModelAssociationType, assocModel: Model, reverseName: string): ModelAssociationConfiguration {
    return {
        name: associationName,

        type: assocType,
        model: assocModel,
        reverse_name: reverseName,
        get reversed () {
            return !!this.reverse_name
        }
    }
}

export function shouldHelpAssociatedModelLinkRelationShip (extModel: Model, associationConfig: ModelAssociationConfiguration) {
    if (!extModel.extends || typeof extModel.extends !== 'object')
        throw `${''}invalid extModel.extends`
    
    return !extModel.extends[associationConfig.name]
    // return associationConfig.reverse_name && !associationConfig.reversed
}

export function getAssociatedModelTobeLinkedOptions (options: ModelAssociationInitOptions__HasOne | ModelAssociationInitOptions__HasMany): ModelAssociationInitOptions__HasOne | ModelAssociationInitOptions__HasMany {
    const newOne = JSON.parse(JSON.stringify(options))
    
    return newOne
}