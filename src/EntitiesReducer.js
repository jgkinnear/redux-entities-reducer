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

	return Object.assign({},
		action,
		{
			entities: action.entities[entityKey],
			entityKey
		}
	);

};

/**
 * Generate Entities Reducer - Accepts the initial state and single entity overrides, and returns the reducer
 *
 * @param initialState
 * @param entityReducers
 * @returns {*}
 */
const EntitiesReducer = (initialState = {}, entityReducers = {}) => (state = initialState, action) => {

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
			return Object.assign({}, Object.keys(action.entities).reduce((eObj, key) => {
				let reducer = entityReducers[key] || entity();
				return eObj[key] = reducer(eObj, buildEntityAction(action, key));
			}, Object.assign({}, state)));
		default:
			return state;
	}
};

export default EntitiesReducer;