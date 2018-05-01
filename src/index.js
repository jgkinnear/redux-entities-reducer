import EntitiesReducer from './EntitiesReducer';
import EntityReducer from './EntityReducer';
import Entity from './Entity';
import EntityController, { hasOne, hasMany } from './EntityController';
import { updateEntities, mergeEntities, replaceEntities, resetEntities, removeEntities } from './EntityActions';
import {
	MERGE_ENTITIES,
	UPDATE_ENTITIES,
	REPLACE_ENTITIES,
	REMOVE_ENTITIES,
	RESET_ENTITIES,
} from './EntitiesActionTypes';

/**
 * Create the controller
 *
 * @param options
 * @returns {EntitiesController}
 */
const createController = (options) => {
	return new EntityController(options);
};

/**
 *
 * @param entityReducers
 * @param defaultEntityReducer
 * @returns {EntitiesReducer}
 */
const createReducer = (entityReducers, defaultEntityReducer) => {
	const initialState = {};
	Object.keys(entityReducers || {}).forEach((reducerKey) => {
		initialState[reducerKey] = {};
	});

	return new EntitiesReducer(initialState, entityReducers, defaultEntityReducer);
};

/**
 * Create the entities reducer
 *
 * @param relations
 * @param types
 * @returns {function(*=, *)}
 */
const createEntityReducer = (relations, types) => {
	return EntityReducer(relations, types);
};

export {
	createController, // Creating a Controller
	createReducer, // Creating a reducer
	createEntityReducer, // Creating an entity reducer
	hasOne,
	hasMany, // Relationship types
	Entity, // Entity Class used for complex extension
	updateEntities,
	mergeEntities,
	replaceEntities,
	resetEntities,
	removeEntities, // Action Creators
	MERGE_ENTITIES,
	UPDATE_ENTITIES,
	REPLACE_ENTITIES,
	REMOVE_ENTITIES,
	RESET_ENTITIES, // Action Types
};
