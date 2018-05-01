import {
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';

import { isEqual } from 'underscore';

/**
 * Strip entities with a deep compare
 *
 * @param normalizedData
 * @param currentState
 * @returns {*}
 */
const stripDeepCompare = (normalizedData, currentState) => {
	let hasChanged = false;
	let changed = {};
	Object.keys(normalizedData).forEach((entityKey) => {
		const entities = normalizedData[entityKey];

		Object.keys(entities).forEach((entityId) => {
			const currentEntity = currentState.entities[entityKey][entityId];
			const newEntity = {
				...(currentEntity || {}),
				...entities[entityId],
			};

			// This tests includes cases where new entity doesn't have requested_at
			if (currentEntity && newEntity && currentEntity.requested_at > newEntity.requested_at) {
				return;
			}

			// If the requested_at were different, we couldn't deep compare
			const newRequestedAt = newEntity.requested_at;
			newEntity.requested_at =
				currentEntity && currentEntity.requested_at ? currentEntity.requested_at : newEntity.requested_at;
			if (!isEqual(newEntity, currentEntity)) {
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
const removeObjectInArraySlice = (payload, arraySlice = []) => {
	return arraySlice.filter((object) => object.id !== payload);
};

/**
 * Replace the keys in an object by array slice
 *
 * @param payload
 * @param arraySlice
 * @returns {Array}
 */
const replaceObjectInArraySlice = (payload = {}, arraySlice = []) => {
	return arraySlice.map((object) => {
		// Return the object if it doesn't match the one we provided
		if (object.id !== payload.id) {
			return object;
		}

		// Return the a new object with the updated properties
		return {
			...object,
			...payload,
		};
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
const createAction = (type, payload = undefined, options = {}) => {
	return Object.assign(
		{
			type,
			payload,
		},
		options,
	);
};

/**
 * Build the action creator for entities
 *
 * @param type
 */
const buildEntityAction = (type) => (entities) => {
	return createAction(type, undefined, { entities });
};

const mergeEntities = buildEntityAction(MERGE_ENTITIES);
const replaceEntities = buildEntityAction(REPLACE_ENTITIES);
const updateEntities = buildEntityAction(UPDATE_ENTITIES);
const resetEntities = buildEntityAction(RESET_ENTITIES);
const removeEntities = buildEntityAction(REMOVE_ENTITIES);

/**
 * Dispatch a merge_entity action once the old and new entities have been compared for changes
 *
 * @param entities
 * @returns {function(*, *)}
 */
const deepCompareMergeEntities = (entities) => (dispatch, getState) => {
	let strippedEntities = stripDeepCompare(entities, getState());

	if (strippedEntities) {
		return dispatch(mergeEntities(strippedEntities));
	}
};

/**
 * Dispatch a update_entity action once the old and new entities have been compared for changes
 *
 * @param entities
 * @returns {function(*, *)}
 */
const deepCompareUpdateEntities = (entities) => (dispatch, getState) => {
	let strippedEntities = stripDeepCompare(entities, getState());

	if (strippedEntities) {
		return dispatch(updateEntities(strippedEntities));
	}
};

export {
	deepCompareUpdateEntities,
	deepCompareMergeEntities,
	stripDeepCompare,
	createAction,
	mergeEntities,
	updateEntities,
	replaceEntities,
	resetEntities,
	removeObjectInArraySlice,
	replaceObjectInArraySlice,
	removeEntities,
};
