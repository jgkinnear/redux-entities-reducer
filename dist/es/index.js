'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_ENTITIES = exports.REMOVE_ENTITIES = exports.REPLACE_ENTITIES = exports.UPDATE_ENTITIES = exports.MERGE_ENTITIES = exports.removeEntities = exports.resetEntities = exports.replaceEntities = exports.mergeEntities = exports.updateEntities = exports.Entity = exports.hasMany = exports.hasOne = exports.createEntityReducer = exports.createReducer = exports.createController = undefined;

var _EntitiesReducer = require('./EntitiesReducer');

var _EntitiesReducer2 = _interopRequireDefault(_EntitiesReducer);

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _EntityController = require('./EntityController');

var _EntityController2 = _interopRequireDefault(_EntityController);

var _EntityActions = require('./EntityActions');

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create the controller
 *
 * @param options
 * @returns {EntitiesController}
 */
var createController = function createController(options) {
  return new _EntityController2.default(options);
};

/**
 *
 * @param entityReducers
 * @param defaultEntityReducer
 * @returns {EntitiesReducer}
 */
var createReducer = function createReducer(entityReducers, defaultEntityReducer) {

  var initialState = {};
  Object.keys(entityReducers || {}).forEach(function (reducerKey) {
    initialState[reducerKey] = {};
  });

  return new _EntitiesReducer2.default(initialState, entityReducers, defaultEntityReducer);
};

/**
 * Create the entities reducer
 *
 * @param relations
 * @param types
 * @returns {function(*=, *)}
 */
var createEntityReducer = function createEntityReducer(relations, types) {
  return (0, _EntityReducer2.default)(relations, types);
};

exports.createController = createController;
exports.createReducer = createReducer;
exports.createEntityReducer = createEntityReducer;
exports.hasOne = _EntityController.hasOne;
exports.hasMany = _EntityController.hasMany;
exports.Entity = _Entity2.default;
exports.updateEntities = _EntityActions.updateEntities;
exports.mergeEntities = _EntityActions.mergeEntities;
exports.replaceEntities = _EntityActions.replaceEntities;
exports.resetEntities = _EntityActions.resetEntities;
exports.removeEntities = _EntityActions.removeEntities;
exports.MERGE_ENTITIES = _EntitiesActionTypes.MERGE_ENTITIES;
exports.UPDATE_ENTITIES = _EntitiesActionTypes.UPDATE_ENTITIES;
exports.REPLACE_ENTITIES = _EntitiesActionTypes.REPLACE_ENTITIES;
exports.REMOVE_ENTITIES = _EntitiesActionTypes.REMOVE_ENTITIES;
exports.RESET_ENTITIES = _EntitiesActionTypes.RESET_ENTITIES;