'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RESET_ENTITIES = exports.REMOVE_ENTITIES = exports.REPLACE_ENTITIES = exports.UPDATE_ENTITIES = exports.MERGE_ENTITIES = exports.replaceEntities = exports.mergeEntities = exports.updateEntities = exports.EntitiesReducer = exports.EntityReducer = undefined;

var _EntitiesReducer = require('./EntitiesReducer');

var _EntitiesReducer2 = _interopRequireDefault(_EntitiesReducer);

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

var _EntityActions = require('./EntityActions');

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EntityReducer = _EntityReducer2.default;
exports.EntitiesReducer = _EntitiesReducer2.default;
exports.updateEntities = _EntityActions.updateEntities;
exports.mergeEntities = _EntityActions.mergeEntities;
exports.replaceEntities = _EntityActions.replaceEntities;
exports.MERGE_ENTITIES = _EntitiesActionTypes.MERGE_ENTITIES;
exports.UPDATE_ENTITIES = _EntitiesActionTypes.UPDATE_ENTITIES;
exports.REPLACE_ENTITIES = _EntitiesActionTypes.REPLACE_ENTITIES;
exports.REMOVE_ENTITIES = _EntitiesActionTypes.REMOVE_ENTITIES;
exports.RESET_ENTITIES = _EntitiesActionTypes.RESET_ENTITIES;