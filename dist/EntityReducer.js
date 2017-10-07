'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {};

/**
 * Hack - Review and rewrite
 * @param array
 * @returns {string|Buffer|Array.<T>}
 */
function arrayUnique(array) {
	var a = array.concat();
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) a.splice(j--, 1);
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
var merge = function merge() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var relations = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

	var mergedEntities = Object.keys(entities).reduce(function (acc, entityId) {
		var actionEntity = entities[entityId];
		var originalEntity = state[entityKey][entityId] || actionEntity;
		var entity = acc[entityId] = Object.assign({}, originalEntity, actionEntity);
		relations.forEach(function (relationKey) {
			if (entity[relationKey] && originalEntity[relationKey]) {
				entity[relationKey] = arrayUnique(originalEntity[relationKey].concat(entity[relationKey]));
			}
		});

		return acc;
	}, {});

	mergedEntities = Object.assign({}, state[entityKey], mergedEntities);

	return Object.assign({}, state, _defineProperty({}, entityKey, mergedEntities));
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

	return Object.assign({}, state, _defineProperty({}, entityKey, entities));
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

	var stateCopy = Object.assign({}, state);
	Object.keys(entities).forEach(function (id) {
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
var replace = function replace() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var newEntities = Object.assign({}, state[entityKey], entities);

	return Object.assign({}, state, _defineProperty({}, entityKey, newEntities));
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
var update = function update() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityKey = arguments[1];
	var entities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var action = arguments[3];

	var propertyUpdateFn = action.updateProperty || updateProperty;

	var updatedEntities = Object.keys(entities).reduce(function (acc, entityId) {
		var actionEntity = entities[entityId];
		var originalEntity = state[entityKey][entityId] || actionEntity;
		acc[entityId] = propertyUpdateFn(entityId, originalEntity, actionEntity, propertyUpdateFn);

		return acc;
	}, {});

	updatedEntities = Object.assign({}, state[entityKey], updatedEntities);

	return Object.assign({}, state, _defineProperty({}, entityKey, updatedEntities));
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
var updateProperty = function updateProperty(key, oldProp, newProp, _updateProperty) {
	if (oldProp === undefined) {
		return newProp;
	}

	switch (newProp && newProp.constructor) {
		case Array:
			// Create new array from old prop so it can be manipulated
			var updatedProp = [].concat(_toConsumableArray(oldProp));

			newProp.forEach(function (prop) {
				if (prop === undefined) {
					return;
				}

				// Object in the entity structure have ids, so find one
				if (prop.constructor === Object) {
					var currentPropIndex = updatedProp.findIndex(function (item) {
						return item.id === prop.id;
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

		case Object:
			// Create list of keys to process
			var newPropKeys = newProp ? Object.keys(newProp) : [];

			// Process each key recursively
			return newPropKeys.reduce(function (updatedProp, key) {
				updatedProp[key] = _updateProperty(key, oldProp[key], newProp[key], _updateProperty);

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