
import {
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';

const initialState = {};

/**
 * Hack - Review and rewrite
 * @param array
 * @returns {string|Buffer|Array.<T>}
 */
function arrayUnique(array) {
	var a = array.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j])
				a.splice(j--, 1);
		}
	}

	return a;
}

/**
 * Merge the given entities with the state. Uses relations for extending reference variables
 *
 * @param state
 * @param entityKey
 * @param entities
 * @param relations
 * @returns {*}
 */
const merge = (state = {}, entityKey, entities={}, relations=[]) => {
	let mergedEntities = Object.keys(entities).reduce( (acc, entityId) => {
		let actionEntity = entities[entityId];
		let originalEntity = state[entityKey][entityId] || actionEntity;
		let entity = acc[entityId] = Object.assign({}, originalEntity, actionEntity);
		relations.forEach((relationKey) => {
			if (entity[relationKey] && originalEntity[relationKey]) {
				entity[relationKey] = arrayUnique(originalEntity[relationKey].concat(entity[relationKey]));
			}
		});

		return acc;
	}, {});

	mergedEntities = Object.assign({}, state[entityKey], mergedEntities);

	return Object.assign({}, state, {[entityKey]: mergedEntities});
};

/**
 * Reset the given entity key with the supplied values
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
const reset = (state = {}, entityKey, entities = {}) => {
	return Object.assign({},
		state,
		{[entityKey]: entities}
	);
};

/**
 * Remove the given entities from the entity key. Leaving the non-matched values in state
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
const remove = (state = {}, entityKey, entities = {}) => {
	let stateCopy = Object.assign({}, state);
	Object.keys(entities).forEach((id) => {
		delete stateCopy[entityKey][id];
	});
	return stateCopy;
};

/**
 * Replace the given entities in state fully, leaving the remaining entities in place
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
const replace = (state = {}, entityKey, entities = {}) => {
	let newEntities = Object.assign({},
		state[entityKey],
		entities
	);

	return Object.assign({},
		state,
		{[entityKey]: newEntities}
	);
};

/**
 * Updates the given entities with the state.
 *
 * @param state
 * @param entityKey
 * @param entities
 * @param action
 * @returns {*}
 */
const update = (state = {}, entityKey, entities = {}, action) => {
	let propertyUpdateFn = action.updateProperty || updateProperty;

	let updatedEntities = Object.keys(entities).reduce( (acc, entityId) => {
		let actionEntity = entities[entityId];
		let originalEntity = state[entityKey][entityId] || actionEntity;
		acc[entityId] = propertyUpdateFn(entityId, originalEntity, actionEntity, propertyUpdateFn);

		return acc;
	}, {});

	updatedEntities = Object.assign({}, state[entityKey], updatedEntities);

	return Object.assign({}, state, {[entityKey]: updatedEntities});
};

/**
 * Updates a singular property.
 *
 * @param entityId
 * @param oldProp
 * @param newProp
 * @param updateProperty
 * @returns {*}
 */
const updateProperty = (key, oldProp, newProp, updateProperty) => {
	if (oldProp === undefined) {
		return newProp;
	}

	switch (newProp && newProp.constructor) {
		case Array:
			// Create new array from old prop so it can be manipulated
			var updatedProp = [...oldProp];

			newProp.forEach((prop) => {
				if (prop === undefined) {
					return;
				}

				// Object in the entity structure have ids, so find one
				if (prop.constructor === Object) {
					var currentPropIndex = updatedProp.findIndex((item) => {
						return item.id === prop.id;
					});

					// If a prop is found, update it
					if (currentPropIndex !== -1) {
						updatedProp[currentPropIndex] = updateProperty(
							currentPropIndex,
							updatedProp[currentPropIndex],
							prop,
							updateProperty
						);
						return;
					}
				} else {
					// Items in the updatedProp already do not need to be added
					// if ($.inArray(prop, updatedProp) !== -1) {
					if (updatedProp.indexOf(prop) !== -1) {
						return;
					}
				}

				// Add item if it does not exist in updatedProp
				updatedProp.push(prop);
			});

			return updatedProp;

		case Object:
			// Create list of keys to process
			var newPropKeys = newProp ? Object.keys(newProp) : [];

			// Process each key recursively
			return newPropKeys.reduce((updatedProp, key) => {
				updatedProp[key] = updateProperty(
					key,
					oldProp[key],
					newProp[key],
					updateProperty
				);

				return updatedProp;
			}, oldProp);

		default:
			// If a new prop has not been supplied, use the old one
			return newProp === undefined ? oldProp : newProp;
	}
};


/**
 * Factory for generating an entity reducers
 *
 * @param relations
 * @param types
 * @returns {function(*=, *)}
 */
const entity = (relations = [], types = [
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
]) => {

	// Validate Types
	if (types.length !== 5) {
		throw new Error('Entity reducers required 5 types [Reset, Replace, Merge, Remove, and Update]');
	}

	// Return the reducer
	return (state = initialState, action) => {

		if (!action.entityKey) {
			throw new Error('An `entityKey` must exist to reduce an entity of any sort');
		}

		if (typeof state[action.entityKey] === 'undefined') {
			throw new Error(`${action.entityKey} does not exist in state. There must be an initial state object set for every available entity`);
		}

		// Extract action types for each type of alteration to entities
		const [MERGE, REMOVE, REPLACE, RESET, UPDATE] = types;

		// Switch based on the action type
		switch (action.type) {

			/**
			 * Reset
			 *
			 * Replaces the given entities values exactly
			 */
			case RESET:
				return reset(state, action.entityKey, action.entities);

			/**
			 * Replace
			 *
			 * Replaces the given entities, however keeps the other, non-matching entities
			 */
			case REPLACE:
				return replace(state, action.entityKey, action.entities);

			/**
			 * Merge
			 *
			 * Merges the given entities with the current set. This utlises the passed in relation keys and will concat where required
			 */
			case MERGE:
				return merge(state, action.entityKey, action.entities, relations);

			/**
			 * Remove
			 *
			 * Removes the given entities, but leaves non-matching entities
			 */
			case REMOVE:
				return remove(state, action.entityKey, action.entities);

			/**
			 * Update
			 *
			 * Updates the given entities, without removing anything
			 */
			case UPDATE:
				return update(state, action.entityKey, action.entities, action);

			default:
				return state;
		}
	};
};

export default entity;