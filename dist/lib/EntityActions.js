'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.removeEntities = exports.replaceObjectInArraySlice = exports.removeObjectInArraySlice = exports.resetEntities = exports.replaceEntities = exports.updateEntities = exports.mergeEntities = exports.createAction = exports.stripDeepCompare = exports.deepCompareMergeEntities = exports.deepCompareUpdateEntities = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _EntitiesActionTypes = require('./EntitiesActionTypes');

var _underscore = require('underscore');

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
			if (!(0, _underscore.isEqual)(newEntity, currentEntity)) {
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

		// Return the updated object
		return _extends({}, object, payload);
	});
};

/**
 * Creates an action
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