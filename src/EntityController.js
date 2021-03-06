import { schema, denormalize, normalize } from 'normalizr';

import Entity from './Entity';
import { createReducer } from './index';

/**
 * Has One relationship
 *
 * @param key
 * @returns {*}
 */
export const hasOne = (key) => {
	return key;
};

/**
 * Has Many Relationship
 *
 * @param key
 * @returns {*[]}
 */
export const hasMany = (key) => {
	return [key];
};

/**
 * Entities Management Controller
 */
export default class EntitiesController {

	/**
	 * Bind register to the class. Using this instead of arrow function props as it will allow class methods to override
	 * the method.
	 */
	constructor() {
		this.register = this.register.bind(this);
	}

	/**
	 * Indicated whether the EntityController has been initialized. The initialize process defines all normalizr relationships.
	 * We can't do this on the fly, as normliazr required all schemas to be defined before create relationships if you
	 * need to support circular relationships
	 * @type {boolean}
	 */
	isInitialized = false;

	/**
	 * Entity Configuration - Used to store the raw configuration of each entity
	 *
	 * @type {{}}
	 * @private
	 */
	_entityConfig = {};

	/**
	 * Stores each entity schema and relationships
	 *
	 * @type {{}}
	 * @private
	 */
	_schemas = {};

	/**
	 * All registered instances of the Entity model, keyed by the entity key
	 *
	 * @type {{}}
	 */
	entities = {};

	/**
	 * Register an entity to the controller
	 *
	 * @param key
	 * @param relations
	 * @param options
	 */
	register(key, relations = {}, options = {}) {
		let instance;

		if (key.prototype instanceof Entity) {
			instance = new key({
				context: this,
			});
			this.entities[instance.key] = instance;
		} else {
			instance = new Entity({ idAttribute: options.idAttribute || 'id', context: this, key, relationships: relations, processStrategy: options.processStrategy, reducer: options.reducer, });
			this.entities[instance.key] = instance;
		}

		this._entityConfig[instance.key] = {
			key: instance.key,
			relations: instance.relationships,
			options: {
				idAttribute: instance.idAttribute,
				processStrategy: instance.processStrategy,
			},
		};
	};

	/**
	 * Initialize the entity
	 *
	 * @param entityConfig
	 */
	initEntity = (entityConfig) => {
		this._schemas[entityConfig.key] = new schema.Entity(entityConfig.key, {}, entityConfig.options);
	};

	/**
	 * Get the registered normalizr schema
	 *
	 * @param key
	 * @returns {*}
	 */
	getSchema = (key) => {
		return this._schemas[key];
	};

	/**
	 * Build an object of all reducers
	 *
	 * @returns {{}}
	 */
	allReducers = () => {
		const reducers = {};

		Object.keys(this.entities).forEach((entityKey) => {
			const entity = this.getEntity(entityKey);
			reducers[entity.key] = entity.reducer();
		});

		return reducers;
	};

	getEntity = (key) => {
		return this.entities[key];
	};

	/**
	 * Initialize the relationships. This must happen after all entity schemas have been initialized
	 *
	 * @param entity
	 */
	initRelations = (entity) => {
		const relations = {};
		const entityConfigRelations = this._entityConfig[entity.key].relations;
		Object.keys(entityConfigRelations).forEach((relationKey) => {
			relations[relationKey] =
				typeof entityConfigRelations[relationKey] === 'object'
					? new schema.Array(this.getSchema(entityConfigRelations[relationKey][0]))
					: this.getSchema(entityConfigRelations[relationKey]);
		});
		this.getSchema(entity.key).define(relations);
	};

	/**
	 * Normalize a given array of entities of the same type
	 *
	 * @param key
	 * @param items
	 */
	normalize = (key, items = []) => {
		return normalize(items, new schema.Array(this.getSchema(key)));
	};

	/**
	 * Denormalize the entities in normalized format for a particular schema
	 *
	 * @param key
	 * @param entities
	 * @param filters
	 */
	denormalize = (key, entities = {}, filters = null) => {
		const schemaEntities = this.getEntity(key).entitySchema(entities); // Only return the related entities
		const keys = Array.isArray(filters) ? filters : Object.keys(schemaEntities[key]);

		return denormalize(keys, [this.getSchema(key)], schemaEntities);
	};

	/**
	 * Initialize the registered entities
	 */
	init = () => {
		if (this.isInitialized) {
			return this;
		}

		Object.keys(this._entityConfig).forEach((key) => this.initEntity(this._entityConfig[key]));
		Object.keys(this._schemas).forEach((key) => this.initRelations(this.getSchema(key)));
		Object.keys(this.entities).forEach((key) => this.getEntity(key).generateEntitySchema());

		this.isInitialized = true;
		return this;
	};

	/**
	 * A wrapper for createReducer, to create the reducer based on what has been registered to the controller
	 *
	 * @returns {EntitiesReducer}
	 */
	createReducer = () => {
		this.init();
		return createReducer(this.allReducers());
	};
}
