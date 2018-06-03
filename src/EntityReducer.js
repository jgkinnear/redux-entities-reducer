import {
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';

const initialState = {};

/**
 * Returns the same array, with duplicate elements removed (strict shallow equality)
 *
 * @param array
 * @returns {[null]}
 */
const makeUniqueArray = (array) => {
	return [...new Set(array)];
};

/**
 * Shallow merge the given entities with the state. Uses relations for extending reference variables
 *
 * @param state
 * @param entityKey
 * @param entities
 * @param relations
 * @returns {*}
 */
const merge = (state = {}, entityKey, entities = {}, relations = []) => {
	if (!entityKey) {
		return state;
	}

	// Loop through all of our provided entities to merge
	const mergedEntities = Object.keys(entities).reduce((acc, entityId) => {
		const actionEntity = entities[entityId]; // New entity
		const originalEntity = state[entityKey][entityId] || actionEntity; // Entity in state

		// If the old entities requested_at is after the new action entity, then don't use the action entity
		if (isEntityOld(actionEntity, originalEntity)) {
			return acc;
		}

		// Create the new entity with the updates
		let entity = { ...originalEntity, ...actionEntity };

		// Loop through our list of provided relationship keys
		relations.forEach((relationKey) => {
			// Ensure that a relationship exists in both the old and the new before merging
			if (entity[relationKey] && originalEntity[relationKey]) {

				// If the two entities are an array, then merge/concat the two relationships together, and make the list of ID's unique
				if (originalEntity[relationKey] instanceof Array && entity[relationKey] instanceof Array) {
					entity[relationKey] = makeUniqueArray(originalEntity[relationKey].concat(entity[relationKey]));
				}
			}
		});

		acc[entityId] = entity; // Set the entity onto the merged entities list

		return acc;
	}, {});

	// Return our entities with our merged in entries
	return {
		...state,
		[entityKey]: {
			...state[entityKey],
			...mergedEntities,
		},
	};
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
	if (!entityKey) {
		return state;
	}

	// Replace the entity slice with the new one
	return { ...state, [entityKey]: entities };
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
	if (!entityKey) {
		return state;
	}

	// Loop through the provided entities and remove them from the entities slice
	let newEntitySlice = { ...state[entityKey] };
	Object.keys(entities).forEach((entityId) => {
		delete newEntitySlice[entityId];
	});

	return { ...state, [entityKey]: newEntitySlice };
};

/**
 * Replace the given entities in state fully, leaving the remaining entities in place
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
const replace = (state = {}, entityKey, entities = {}) => {
	if (!entityKey) {
		return state;
	}

	// Return our updated entities
	return {
		...state,
		[entityKey]: {
			...state[entityKey],
			...entities,
		},
	};
};

/**
 * If the old entities requested at is after the new action entity, then don't use the action entity
 *
 * @param actionEntity
 * @param originalEntity
 * @returns {boolean}
 */
const isEntityOld = (actionEntity, originalEntity) => {
	// If the actionEntity.requested_at exists and is lower than the one in the original entity
	// then we will want to use the originalEntity
	return actionEntity.requested_at && actionEntity.requested_at < originalEntity.requested_at;
};

/**
 * Recursively updates the given entities with the state.
 *
 * @param state
 * @param entityKey
 * @param entities
 * @param action
 * @returns {*}
 */
const update = (state = {}, entityKey, entities = {}, action = {}) => {
	if (!entityKey) {
		return state;
	}

	// The function we want to use to process the updates on the entity property
	const propertyUpdateFn = action.updateProperty || updateProperty;

	// Loop through all of our provided entities to update
	let updatedEntities = Object.keys(entities).reduce((acc, entityId) => {
		const actionEntity = entities[entityId]; // New entity
		const originalEntity = state[entityKey][entityId] || actionEntity; // Entity in state

		// If the old entities requested_at is after the new action entity, then don't use the action entity
		if (isEntityOld(actionEntity, originalEntity)) {
			return acc;
		}

		// Recursively update the entity properties
		acc[entityId] = propertyUpdateFn(entityId, originalEntity, actionEntity, propertyUpdateFn);
		return acc;
	}, {});

	// Return our entities with our updated entries
	return {
		...state,
		[entityKey]: {
			...state[entityKey],
			...updatedEntities,
		},
	};
};

/**
 * Recursively updates a singular property.
 *
 * @param entityId
 * @param oldProp
 * @param newProp
 * @param updateProperty
 * @returns {*}
 */
const updateProperty = (entityId, oldProp, newProp, updateProperty) => {
	if (oldProp === undefined) {
		return newProp;
	}

	// Check what type of object the new property is
	switch (newProp && newProp.constructor) {
		case Array: {
			// FIXME: When using updateEntities with override from object to empty value
			// -> Unhandled Rejection (TypeError): Cannot convert undefined or null to object

			// Create new array from old prop so it can be manipulated
			let updatedProp = [...oldProp];

			// Loop through the array of properties
			newProp.forEach((prop) => {
				if (prop === undefined) {
					return;
				}

				// Object in the entity structure have ids, so find one
				if (prop.constructor === Object) {
					// The item exists if there is a matching item with the same ID
					const currentPropIndex = updatedProp.findIndex((item) => {
						// TODO: Other methods of matching

						// If the item has an ID, try and find the index, otherwise use the objects reference
						return item.id && item.id === prop.id;
					});

					// If a prop is found, update it
					if (currentPropIndex !== -1) {
						updatedProp[currentPropIndex] = updateProperty(
							currentPropIndex,
							updatedProp[currentPropIndex],
							prop,
							updateProperty,
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
		}

		case Object: {
			// Process each key recursively
			return Object.keys(newProp).reduce((acc, entityKey) => {
				// Update the properties
				acc[entityKey] = updateProperty(entityKey, oldProp[entityKey], newProp[entityKey], updateProperty);

				return acc;
			}, oldProp);
		}

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
const entity = (
	relations = [],
	types = [MERGE_ENTITIES, REMOVE_ENTITIES, REPLACE_ENTITIES, RESET_ENTITIES, UPDATE_ENTITIES],
) => {
	// Validate Types
	if (types.length !== 5) {
		throw new Error('Entity reducers required 5 types [Reset, Replace, Merge, Remove, and Update]');
	}

	// Return the reducer
	return (state = initialState, action) => {
		if (!action.type) {
			return state;
		}

		if (!action.entityKey) {
			throw new Error('An `entityKey` must exist to reduce an entity of any sort');
		}

		if (typeof state[action.entityKey] === 'undefined') {
			throw new Error(
				`${
					action.entityKey
				} does not exist in state. There must be an initial state object set for every available entity`,
			);
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
export { isEntityOld, makeUniqueArray, merge, reset, remove, replace, update, updateProperty };
