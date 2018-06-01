'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateProperty = exports.update = exports.replace = exports.remove = exports.reset = exports.merge = exports.makeUniqueArray = exports.isEntityOld = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {};

/**
 * Returns the same array, with duplicate elements removed (strict shallow equality)
 *
 * @param array
 * @returns {[null]}
 */
var makeUniqueArray = function makeUniqueArray(array) {
	return [].concat(_toConsumableArray(new Set(array)));
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
var merge = function merge() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var relations = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

	if (!entityKey) {
		return state;
	}

	// Loop through all of our provided entities to merge
	var mergedEntities = Object.keys(entities).reduce(function (acc, entityId) {
		var actionEntity = entities[entityId]; // New entity
		var originalEntity = state[entityKey][entityId] || actionEntity; // Entity in state

		// If the old entities requested_at is after the new action entity, then don't use the action entity
		if (isEntityOld(actionEntity, originalEntity)) {
			return acc;
		}

		// Create the new entity with the updates
		var entity = _extends({}, originalEntity, actionEntity);

		// Loop through our list of provided relationship keys
		relations.forEach(function (relationKey) {
			// Ensure that a relationship exists in both the old and the new before merging
			if (entity[relationKey] && originalEntity[relationKey]) {
				// Merge/concat the two relationships together, and make the list of ID's unique
				entity[relationKey] = makeUniqueArray(originalEntity[relationKey].concat(entity[relationKey]));
			}
		});

		acc[entityId] = entity; // Set the entity onto the merged entities list

		return acc;
	}, {});

	// Return our entities with our merged in entries
	return _extends({}, state, _defineProperty({}, entityKey, _extends({}, state[entityKey], mergedEntities)));
};

/**
 * Reset the given entity key with the supplied values
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
var reset = function reset() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (!entityKey) {
		return state;
	}

	// Replace the entity slice with the new one
	return _extends({}, state, _defineProperty({}, entityKey, entities));
};

/**
 * Remove the given entities from the entity key. Leaving the non-matched values in state
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
var remove = function remove() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (!entityKey) {
		return state;
	}

	// Loop through the provided entities and remove them from the entities slice
	var newEntitySlice = _extends({}, state[entityKey]);
	Object.keys(entities).forEach(function (entityId) {
		delete newEntitySlice[entityId];
	});

	return _extends({}, state, _defineProperty({}, entityKey, newEntitySlice));
};

/**
 * Replace the given entities in state fully, leaving the remaining entities in place
 *
 * @param state
 * @param entityKey
 * @param entities
 * @returns {*}
 */
var replace = function replace() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (!entityKey) {
		return state;
	}

	// Return our updated entities
	return _extends({}, state, _defineProperty({}, entityKey, _extends({}, state[entityKey], entities)));
};

/**
 * If the old entities requested at is after the new action entity, then don't use the action entity
 *
 * @param actionEntity
 * @param originalEntity
 * @returns {boolean}
 */
var isEntityOld = function isEntityOld(actionEntity, originalEntity) {
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
var update = function update() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	if (!entityKey) {
		return state;
	}

	// The function we want to use to process the updates on the entity property
	var propertyUpdateFn = action.updateProperty || updateProperty;

	// Loop through all of our provided entities to update
	var updatedEntities = Object.keys(entities).reduce(function (acc, entityId) {
		var actionEntity = entities[entityId]; // New entity
		var originalEntity = state[entityKey][entityId] || actionEntity; // Entity in state

		// If the old entities requested_at is after the new action entity, then don't use the action entity
		if (isEntityOld(actionEntity, originalEntity)) {
			return acc;
		}

		// Recursively update the entity properties
		acc[entityId] = propertyUpdateFn(entityId, originalEntity, actionEntity, propertyUpdateFn);
		return acc;
	}, {});

	// Return our entities with our updated entries
	return _extends({}, state, _defineProperty({}, entityKey, _extends({}, state[entityKey], updatedEntities)));
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
var updateProperty = function updateProperty(entityId, oldProp, newProp, _updateProperty) {
	if (oldProp === undefined) {
		return newProp;
	}

	// Check what type of object the new property is
	switch (newProp && newProp.constructor) {
		case Array:
			{
				// FIXME: When using updateEntities with override from object to empty value
				// -> Unhandled Rejection (TypeError): Cannot convert undefined or null to object

				// Create new array from old prop so it can be manipulated
				var updatedProp = [].concat(_toConsumableArray(oldProp));

				// Loop through the array of properties
				newProp.forEach(function (prop) {
					if (prop === undefined) {
						return;
					}

					// Object in the entity structure have ids, so find one
					if (prop.constructor === Object) {
						// The item exists if there is a matching item with the same ID
						var currentPropIndex = updatedProp.findIndex(function (item) {
							// TODO: Other methods of matching

							// If the item has an ID, try and find the index, otherwise use the objects reference
							return item.id && item.id === prop.id;
						});

						// If a prop is found, update it
						if (currentPropIndex !== -1) {
							updatedProp[currentPropIndex] = _updateProperty(currentPropIndex, updatedProp[currentPropIndex], prop, _updateProperty);

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

		case Object:
			{
				// Process each key recursively
				return Object.keys(newProp).reduce(function (acc, entityKey) {
					// Update the properties
					acc[entityKey] = _updateProperty(entityKey, oldProp[entityKey], newProp[entityKey], _updateProperty);

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
var entity = function entity() {
	var relations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [_EntitiesActionTypes.MERGE_ENTITIES, _EntitiesActionTypes.REMOVE_ENTITIES, _EntitiesActionTypes.REPLACE_ENTITIES, _EntitiesActionTypes.RESET_ENTITIES, _EntitiesActionTypes.UPDATE_ENTITIES];

	// Validate Types
	if (types.length !== 5) {
		throw new Error('Entity reducers required 5 types [Reset, Replace, Merge, Remove, and Update]');
	}

	// Return the reducer
	return function () {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];

		if (!action.type) {
			return state;
		}

		if (!action.entityKey) {
			throw new Error('An `entityKey` must exist to reduce an entity of any sort');
		}

		if (typeof state[action.entityKey] === 'undefined') {
			throw new Error(action.entityKey + ' does not exist in state. There must be an initial state object set for every available entity');
		}

		// Extract action types for each type of alteration to entities

		var _types = _slicedToArray(types, 5),
		    MERGE = _types[0],
		    REMOVE = _types[1],
		    REPLACE = _types[2],
		    RESET = _types[3],
		    UPDATE = _types[4];

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

exports.default = entity;
exports.isEntityOld = isEntityOld;
exports.makeUniqueArray = makeUniqueArray;
exports.merge = merge;
exports.reset = reset;
exports.remove = remove;
exports.replace = replace;
exports.update = update;
exports.updateProperty = updateProperty;