'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.buildEntitySchema = exports.getSchemaRelations = exports.removeEntities = exports.replaceObjectInArraySlice = exports.removeObjectInArraySlice = exports.resetEntities = exports.replaceEntities = exports.updateEntities = exports.mergeEntities = exports.createAction = exports.stripDeepCompare = exports.deepCompareMergeEntities = exports.deepCompareUpdateEntities = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _normalizr = require('normalizr');

var _reselect = require('reselect');

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Strip entities with a deep compare
 *
 * @param normalizedData
 * @param currentState
 * @returns {*}
 */
var stripDeepCompare = function stripDeepCompare(normalizedData, currentState) {
	var hasChanged = false;
	var changed = {};
	Object.keys(normalizedData).forEach(function (entityKey) {
		var entities = normalizedData[entityKey];

		Object.keys(entities).forEach(function (entityId) {
			var currentEntity = currentState.entities[entityKey][entityId];
			var newEntity = _extends({}, currentEntity || {}, entities[entityId]);

			// This tests includes cases where new entity doesn't have requested_at
			if (currentEntity && newEntity && currentEntity.requested_at > newEntity.requested_at) {
				return;
			}

			// If the requested_at were different, we couldn't deep compare
			var newRequestedAt = newEntity.requested_at;
			newEntity.requested_at = currentEntity && currentEntity.requested_at ? currentEntity.requested_at : newEntity.requested_at;
			if (!(0, _isEqual2.default)(newEntity, currentEntity)) {
				if (!changed[entityKey]) {
					changed[entityKey] = {};
				}

				// Adds back the latest requested_at field.
				newEntity.requested_at = newRequestedAt;

				changed[entityKey][entityId] = newEntity;
				hasChanged = true;
			}
		});
	});

	// TODO: Improve so the function doesn't return mixed values
	if (!hasChanged) {
		return false;
	}

	return changed;
};

/**
 * Remove an object by ID from an array slice
 *
 * @param payload
 * @param arraySlice
 * @returns {Array}
 */
var removeObjectInArraySlice = function removeObjectInArraySlice(payload) {
	var arraySlice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return arraySlice.filter(function (object) {
		return object.id !== payload;
	});
};

/**
 * Replace the keys in an object by array slice
 *
 * @param payload
 * @param arraySlice
 * @returns {Array}
 */
var replaceObjectInArraySlice = function replaceObjectInArraySlice() {
	var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var arraySlice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return arraySlice.map(function (object) {
		// Return the object if it doesn't match the one we provided
		if (object.id !== payload.id) {
			return object;
		}

		// Return the a new object with the updated properties
		return _extends({}, object, payload);
	});
};

/**
 * Creates an action in a consistent format
 *
 * @param type
 * @param payload
 * @param options
 * @return {Object}
 */
var createAction = function createAction(type) {
	var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	return Object.assign({
		type: type,
		payload: payload
	}, options);
};

/**
 * Build the action creator for entities
 *
 * @param type
 */
var buildEntityAction = function buildEntityAction(type) {
	return function (entities) {
		return createAction(type, undefined, { entities: entities });
	};
};

var mergeEntities = buildEntityAction(_EntitiesActionTypes.MERGE_ENTITIES);
var replaceEntities = buildEntityAction(_EntitiesActionTypes.REPLACE_ENTITIES);
var updateEntities = buildEntityAction(_EntitiesActionTypes.UPDATE_ENTITIES);
var resetEntities = buildEntityAction(_EntitiesActionTypes.RESET_ENTITIES);
var removeEntities = buildEntityAction(_EntitiesActionTypes.REMOVE_ENTITIES);

/**
 * Dispatch a merge_entity action once the old and new entities have been compared for changes
 *
 * @param entities
 * @returns {function(*, *)}
 */
var deepCompareMergeEntities = function deepCompareMergeEntities(entities) {
	return function (dispatch, getState) {
		var strippedEntities = stripDeepCompare(entities, getState());

		if (strippedEntities) {
			return dispatch(mergeEntities(strippedEntities));
		}
	};
};

/**
 * Dispatch a update_entity action once the old and new entities have been compared for changes
 *
 * @param entities
 * @returns {function(*, *)}
 */
var deepCompareUpdateEntities = function deepCompareUpdateEntities(entities) {
	return function (dispatch, getState) {
		var strippedEntities = stripDeepCompare(entities, getState());

		if (strippedEntities) {
			return dispatch(updateEntities(strippedEntities));
		}
	};
};

/**
 * Build a schema tree of a given entity schema. You can pass through a Entity or Array Schema
 *
 * @param entitySchema
 * @param keys
 * @param assessed
 * @returns {Array}
 */
var getSchemaRelations = function getSchemaRelations(entitySchema) {
	var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var assessed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	if (entitySchema.constructor.name === 'ArraySchema' || entitySchema instanceof _normalizr.schema.Array) {
		return getSchemaRelations(entitySchema.schema, keys, assessed);
	} else if (entitySchema instanceof Array && entitySchema.length > 0) {
		return getSchemaRelations(entitySchema[0], keys, assessed);
	}

	if (assessed.indexOf(entitySchema) !== -1) {
		return keys;
	}

	if (entitySchema.schema) {
		if (entitySchema._key && keys.indexOf(entitySchema._key) === -1) {
			keys.push(entitySchema._key);
			assessed.push(entitySchema);
		}

		Object.keys(entitySchema.schema).forEach(function (schemaKey) {
			keys = getSchemaRelations(entitySchema.schema[schemaKey], keys, assessed);
		});
	}

	return keys;
};

/**
 * Build a memoized function that extracts keys from an entities slice
 *
 * @param scheme
 * @returns {*}
 */
var buildEntitySchema = function buildEntitySchema(scheme) {
	var keys = getSchemaRelations(scheme);
	var selectorFunctions = keys.reduce(function (acc, key) {
		acc.push(function (entities) {
			return entities[key];
		});

		return acc;
	}, []);

	return (0, _reselect.createSelector)(selectorFunctions, function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var entities = {};
		keys.forEach(function (key, index) {
			entities[key] = args[index];
		});

		return entities;
	});
};

exports.deepCompareUpdateEntities = deepCompareUpdateEntities;
exports.deepCompareMergeEntities = deepCompareMergeEntities;
exports.stripDeepCompare = stripDeepCompare;
exports.createAction = createAction;
exports.mergeEntities = mergeEntities;
exports.updateEntities = updateEntities;
exports.replaceEntities = replaceEntities;
exports.resetEntities = resetEntities;
exports.removeObjectInArraySlice = removeObjectInArraySlice;
exports.replaceObjectInArraySlice = replaceObjectInArraySlice;
exports.removeEntities = removeEntities;
exports.getSchemaRelations = getSchemaRelations;
exports.buildEntitySchema = buildEntitySchema;