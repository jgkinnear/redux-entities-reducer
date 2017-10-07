'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEntities = exports.mergeEntities = exports.replaceEntities = undefined;

var _EntitiesActionTypes = require('./EntitiesActionTypes');

/**
 * Replace entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
var replaceEntities = exports.replaceEntities = function replaceEntities(entities) {
  return {
    type: _EntitiesActionTypes.REPLACE_ENTITIES,
    entities: entities
  };
};

/**
 * Merge entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
var mergeEntities = exports.mergeEntities = function mergeEntities(entities) {
  return {
    type: _EntitiesActionTypes.MERGE_ENTITIES,
    entities: entities
  };
};

/**
 * Merge entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
var updateEntities = exports.updateEntities = function updateEntities(entities) {
  return {
    type: _EntitiesActionTypes.UPDATE_ENTITIES,
    entities: entities
  };
};