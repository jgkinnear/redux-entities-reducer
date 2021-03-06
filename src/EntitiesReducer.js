import entity from './EntityReducer';

import {
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';

/**
 * Build the entity action.
 *
 * NOTE: This action does not get dispatched, and it is generally not recommended to build actions in the reducers. However
 * this should be considered as supplying extra data for the action
 *
 * @param action
 * @param entityKey
 * @returns {*}
 */
const buildEntityAction = (action, entityKey) => {
	return Object.assign({}, action, {
		entities: action.entities[entityKey],
		entityKey,
	});
};

/**
 * Generate Entities Reducer - Accepts the initial state and single entity overrides, and returns the reducer. You can
 * also provide the default entity reducer to use
 *
 * @param initialState
 * @param entityReducers
 * @param defaultEntityReducer
 * @returns {*}
 */
const EntitiesReducer = (initialState = {}, entityReducers = {}, defaultEntityReducer = entity()) => (
	state = initialState,
	action,
) => {
	switch (action.type) {
		/**
		 * Standard Entity handlers
		 */
		case MERGE_ENTITIES:
		case REMOVE_ENTITIES:
		case REPLACE_ENTITIES:
		case RESET_ENTITIES:
		case UPDATE_ENTITIES:
			// NOTE: this was reduced to an un-readable form to avoid eslint complaints.
			// Looping through the supplied entities and calling the entity.js reducer, which handles
			// merging, replacing, resetting and removing entities from state
			Object.keys(action.entities).forEach((key) => {
				let reducer = entityReducers[key] || defaultEntityReducer;
				state = reducer(state, buildEntityAction(action, key));
			});

			return state;
		default:
			return state;
	}
};

export default EntitiesReducer;
