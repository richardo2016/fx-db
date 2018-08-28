Object.defineProperty(exports, "__esModule", { value: true });
function upperCaseFirstChar(str = '') {
    return str[0].toUpperCase() + str.substr(1);
}
function buildAssociationMethodName(actionType, associationName, associationType) {
    switch (associationType) {
        case 'hasOne':
            return `${actionType}${upperCaseFirstChar(associationName)}Sync`;
        case 'hasMany':
            return `${actionType}${upperCaseFirstChar(associationName)}sSync`;
    }
}
exports.buildAssociationMethodName = buildAssociationMethodName;
function getModelExtendModelHash(model) {
    if (!model.extends)
        return {};
    if (typeof model.extends !== 'object') {
        throw `invalid type of model ${model.name}'s extends`;
    }
    return model.extends || {};
}
exports.getModelExtendModelHash = getModelExtendModelHash;
function buildModelAssociationConfiguration(associationName, assocType, assocModel, reverseName) {
    return {
        name: associationName,
        type: assocType,
        model: assocModel,
        reverse_name: reverseName,
        get reversed() {
            return !!this.reverse_name;
        }
    };
}
exports.buildModelAssociationConfiguration = buildModelAssociationConfiguration;
function shouldHelpAssociatedModelLinkRelationShip(extModel, associationConfig) {
    if (!extModel.extends || typeof extModel.extends !== 'object')
        throw `${''}invalid extModel.extends`;
    return !extModel.extends[associationConfig.name];
    // return associationConfig.reverse_name && !associationConfig.reversed
}
exports.shouldHelpAssociatedModelLinkRelationShip = shouldHelpAssociatedModelLinkRelationShip;
function getAssociatedModelTobeLinkedOptions(options) {
    const newOne = JSON.parse(JSON.stringify(options));
    return newOne;
}
exports.getAssociatedModelTobeLinkedOptions = getAssociatedModelTobeLinkedOptions;
