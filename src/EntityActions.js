import {
	REPLACE_ENTITIES,
	MERGE_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';

/**
 * Replace entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
export const replaceEntities = (entities) => {
	return {
		type: REPLACE_ENTITIES,
		entities
	}
};

/**
 * Merge entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
export const mergeEntities = (entities) => {
	return {
		type: MERGE_ENTITIES,
		entities
	}
};

/**
 * Merge entities
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
export const updateEntities = (entities) => {
	return {
		type: UPDATE_ENTITIES,
		entities
	}
};
