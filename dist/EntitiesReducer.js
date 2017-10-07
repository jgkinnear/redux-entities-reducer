'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var buildEntityAction = function buildEntityAction(action, entityKey) {

	return Object.assign({}, action, {
		entities: action.entities[entityKey],
		entityKey: entityKey
	});
};

/**
 * Generate Entities Reducer - Accepts the initial state and single entity overrides, and returns the reducer
 *
 * @param initialState
 * @param entityReducers
 * @returns {*}
 */
var EntitiesReducer = function EntitiesReducer() {
	var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var entityReducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	return function () {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];


		switch (action.type) {

			/**
    * Standard Entity handlers
    */
			case _EntitiesActionTypes.MERGE_ENTITIES:
			case _EntitiesActionTypes.REMOVE_ENTITIES:
			case _EntitiesActionTypes.REPLACE_ENTITIES:
			case _EntitiesActionTypes.RESET_ENTITIES:
			case _EntitiesActionTypes.UPDATE_ENTITIES:

				// NOTE: this was reduced to an un-readable form to avoid eslint complaints.
				// Looping through the supplied entities and calling the entity.js reducer, which handles
				// merging, replacing, resetting and removing entities from state
				return Object.assign({}, Object.keys(action.entities).reduce(function (eObj, key) {
					var reducer = entityReducers[key] || (0, _EntityReducer2.default)();
					return eObj[key] = reducer(eObj, buildEntityAction(action, key));
				}, Object.assign({}, state)));
			default:
				return state;
		}
	};
};

exports.default = EntitiesReducer;