'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity =

/**
 * Constructor
 *
 * @param options
 */


/**
 * A function to process incoming entities
 */


/**
 * The Entity Controller to provide context for the Entity
 */
function Entity(options) {
	var _this = this;

	_classCallCheck(this, Entity);

	this.key = undefined;
	this.context = undefined;
	this.relationships = undefined;
	this.processStrategy = undefined;
	this.types = [_EntitiesActionTypes.MERGE_ENTITIES, _EntitiesActionTypes.REMOVE_ENTITIES, _EntitiesActionTypes.REPLACE_ENTITIES, _EntitiesActionTypes.RESET_ENTITIES, _EntitiesActionTypes.UPDATE_ENTITIES];

	this.setContext = function (context) {
		_this.context = context;
	};

	this.normalize = function (data) {
		return _this.context.normalize(_this.key, data);
	};

	this.denormalize = function (data) {
		return _this.context.denormalize(_this.key, data);
	};

	this.merge = function (data) {
		return _this.context.merge(_this.key, data);
	};

	this.update = function (data) {
		return _this.context.update(_this.key, data);
	};

	this.reset = function (data) {
		return _this.context.reset(_this.key, data);
	};

	this.replace = function (data) {
		return _this.context.replace(_this.key, data);
	};

	this.remove = function (data) {
		return _this.context.remove(_this.key, data);
	};

	this.reducer = function () {
		return (0, _EntityReducer2.default)(Object.keys(_this.relationships), _this.types);
	};

	var copyProps = ['context', 'key', 'relationships', 'processStrategy', 'reducer'];
	copyProps.forEach(function (prop) {
		if (options[prop] !== undefined) {
			_this[prop] = options[prop];
		}
	});
}

/**
 * Set the context for an instance.
 *
 * @param context
 */


/**
 * The type of actions the entity can handle.
 * TODO: Currently this order is important as it maps to the EntityReducer. This structure should be changed to be
 *       more explicit
 * @type {*[]}
 */


/**
 * The relationship definitions
 */

/**
 * The Key in which the entity is stored under. This is the key within the redux store, as well the key for
 * relationship references
 */


/**
 * Normalize and Denormalize method maps
 */


/**
 * Action method mapping
 *
 * The context (EntityController) was originally built to provide all of the functionality for the library, and this
 * Entity class was meant to be used to provide advanced customization.
 *
 * TODO: Consider moving all logic for these actions (as well as normalize/denormalize) into this class and leave the
 *       EntityController to just be a registry for the entities
 *
 */


/**
 * Creates the reducer to be used in the EntityReducer. It automatically creates the entity reducer with the
 * appropriate relations. This method is mostly used for the `allReducers` method on the EntityController.
 *
 * @returns {function(*=, *)}
 */
;

exports.default = Entity;