'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.hasMany = exports.hasOne = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _normalizr = require('normalizr');

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Has One relationship
 *
 * @param key
 * @returns {*}
 */
var hasOne = exports.hasOne = function hasOne(key) {
	return key;
};

/**
 * Has Many Relationship
 *
 * @param key
 * @returns {*[]}
 */
var hasMany = exports.hasMany = function hasMany(key) {
	return [key];
};

/**
 * Entities Management Controller
 */

var EntitiesController = function () {

	/**
  * Bind register to the class. Using this instead of arrow function props as it will allow class methods to override
  * the method.
  */
	function EntitiesController() {
		var _this = this;

		_classCallCheck(this, EntitiesController);

		this.isInitialized = false;
		this._entityConfig = {};
		this._schemas = {};
		this.entities = {};

		this.initEntity = function (entityConfig) {
			_this._schemas[entityConfig.key] = new _normalizr.schema.Entity(entityConfig.key, {}, entityConfig.options);
		};

		this.getSchema = function (key) {
			return _this._schemas[key];
		};

		this.allReducers = function () {
			var reducers = {};

			Object.keys(_this.entities).forEach(function (entityKey) {
				var entity = _this.getEntity(entityKey);
				reducers[entity.key] = entity.reducer();
			});

			return reducers;
		};

		this.getEntity = function (key) {
			return _this.entities[key];
		};

		this.initRelations = function (entity) {
			var relations = {};
			var entityConfigRelations = _this._entityConfig[entity.key].relations;
			Object.keys(entityConfigRelations).forEach(function (relationKey) {
				relations[relationKey] = _typeof(entityConfigRelations[relationKey]) === 'object' ? new _normalizr.schema.Array(_this.getSchema(entityConfigRelations[relationKey][0])) : _this.getSchema(entityConfigRelations[relationKey]);
			});
			_this.getSchema(entity.key).define(relations);
		};

		this.normalize = function (key) {
			var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			return (0, _normalizr.normalize)(items, new _normalizr.schema.Array(_this.getSchema(key)));
		};

		this.denormalize = function (key) {
			var entities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var schemaEntities = _this.getEntity(key).entitySchema(entities); // Only return the related entities
			var keys = Array.isArray(filters) ? filters : Object.keys(schemaEntities[key]);

			return (0, _normalizr.denormalize)(keys, [_this.getSchema(key)], schemaEntities);
		};

		this.init = function () {
			if (_this.isInitialized) {
				return _this;
			}

			Object.keys(_this._entityConfig).forEach(function (key) {
				return _this.initEntity(_this._entityConfig[key]);
			});
			Object.keys(_this._schemas).forEach(function (key) {
				return _this.initRelations(_this.getSchema(key));
			});
			Object.keys(_this.entities).forEach(function (key) {
				return _this.getEntity(key).generateEntitySchema();
			});

			_this.isInitialized = true;
			return _this;
		};

		this.createReducer = function () {
			_this.init();
			return (0, _index.createReducer)(_this.allReducers());
		};

		this.register = this.register.bind(this);
	}

	/**
  * Indicated whether the EntityController has been initialized. The initialize process defines all normalizr relationships.
  * We can't do this on the fly, as normliazr required all schemas to be defined before create relationships if you
  * need to support circular relationships
  * @type {boolean}
  */


	/**
  * Entity Configuration - Used to store the raw configuration of each entity
  *
  * @type {{}}
  * @private
  */


	/**
  * Stores each entity schema and relationships
  *
  * @type {{}}
  * @private
  */


	/**
  * All registered instances of the Entity model, keyed by the entity key
  *
  * @type {{}}
  */


	_createClass(EntitiesController, [{
		key: 'register',


		/**
   * Register an entity to the controller
   *
   * @param key
   * @param relations
   * @param options
   */
		value: function register(key) {
			var relations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var instance = void 0;

			if (key.prototype instanceof _Entity2.default) {
				instance = new key({
					context: this
				});
				this.entities[instance.key] = instance;
			} else {
				instance = new _Entity2.default({ idAttribute: options.idAttribute || 'id', context: this, key: key, relationships: relations, processStrategy: options.processStrategy, reducer: options.reducer });
				this.entities[instance.key] = instance;
			}

			this._entityConfig[instance.key] = {
				key: instance.key,
				relations: instance.relationships,
				options: {
					idAttribute: instance.idAttribute,
					processStrategy: instance.processStrategy
				}
			};
		}

		/**
   * Initialize the entity
   *
   * @param entityConfig
   */


		/**
   * Get the registered normalizr schema
   *
   * @param key
   * @returns {*}
   */


		/**
   * Build an object of all reducers
   *
   * @returns {{}}
   */


		/**
   * Initialize the relationships. This must happen after all entity schemas have been initialized
   *
   * @param entity
   */


		/**
   * Normalize a given array of entities of the same type
   *
   * @param key
   * @param items
   */


		/**
   * Denormalize the entities in normalized format for a particular schema
   *
   * @param key
   * @param entities
   * @param filters
   */


		/**
   * Initialize the registered entities
   */


		/**
   * A wrapper for createReducer, to create the reducer based on what has been registered to the controller
   *
   * @returns {EntitiesReducer}
   */

	}]);

	return EntitiesController;
}();

exports.default = EntitiesController;