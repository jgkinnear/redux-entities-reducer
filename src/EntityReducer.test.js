import {
	MERGE_ENTITIES,
	REPLACE_ENTITIES,
	REMOVE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';
import entity, {
	makeUniqueArray,
	isEntityOld,
	merge,
	reset,
	remove,
	replace,
	update,
	updateProperty,
} from './EntityReducer';

describe('entity::entity', () => {
	it('should return a function', () => {
		expect(entity()).toBeInstanceOf(Function);
	});

	it('should throw an error if types missing', () => {
		expect(() => entity([], [MERGE_ENTITIES, REMOVE_ENTITIES])).toThrowError(
			'Entity reducers required 5 types [Reset, Replace, Merge, Remove, and Update]',
		);
	});
});

describe('entity::entityReducer', () => {
	const entityReducer = entity();
	const defaultObjectEntities = {
		test: { 1: { id: 1, value: true, randomValue: 'test' }, 2: { id: 2, value: false, randomValue: 'hello' } },
	};
	const defaultObjectEntitiesWithArray = {
		test: {
			1: {
				id: 1,
				value: true,
				randomValue: 'test',
				list: [
					{
						id: 1,
						value: true,
					},
					{ id: 2, value: true },
				],
			},
			2: {
				id: 2,
				value: false,
				randomValue: 'hello',
				list: [
					{
						id: 3,
						value: true,
					},
					{ id: 4, value: true },
				],
			},
		},
	};

	it('should return state when action type missing', () => {
		expect(entityReducer(defaultObjectEntities, {})).toEqual(defaultObjectEntities);
	});

	it('should throw an error if entityKey missing', () => {
		expect(() => entityReducer(undefined, { type: 'test' })).toThrowError(
			'An `entityKey` must exist to reduce an entity of any sort',
		);
	});

	it('should throw an error if entityKey missing from state', () => {
		expect(() => entityReducer(undefined, { type: 'test', entityKey: 'entities' })).toThrowError(
			'entities does not exist in state. There must be an initial state object set for every available entity',
		);
	});

	it('run RESET_ENTITIES', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntities },
				{
					type: RESET_ENTITIES,
					entityKey: 'entities',
					entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
				},
			),
		).toEqual({
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
		});
	});

	it('run REMOVE_ENTITIES', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntities },
				{
					type: REMOVE_ENTITIES,
					entityKey: 'entities',
					entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
				},
			),
		).toEqual({
			entities: {},
		});
	});

	it('run REPLACE_ENTITIES', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntities },
				{
					type: REPLACE_ENTITIES,
					entityKey: 'entities',
					entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
				},
			),
		).toEqual({
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
		});
	});

	it('run MERGE_ENTITIES', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntities },
				{
					type: MERGE_ENTITIES,
					entityKey: 'entities',
					entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
				},
			),
		).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true },
					2: { id: 2, value: false, randomValue: 'hello' },
				},
			},
		});
	});

	it('run UPDATE_ENTITIES', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntities },
				{
					type: UPDATE_ENTITIES,
					entityKey: 'entities',
					entities: { test: { 1: { id: 1, value: false, anotherValue: true } } },
				},
			),
		).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, randomValue: 'test' },
					2: { id: 2, value: false, randomValue: 'hello' },
				},
			},
		});
	});

	it('run RESET_ENTITIES (with array)', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntitiesWithArray },
				{
					type: RESET_ENTITIES,
					entityKey: 'entities',
					entities: {
						test: {
							1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
						},
					},
				},
			),
		).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
				},
			},
		});
	});

	it('run REMOVE_ENTITIES (with array)', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntitiesWithArray },
				{
					type: REMOVE_ENTITIES,
					entityKey: 'entities',
					entities: {
						test: {
							1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
						},
					},
				},
			),
		).toEqual({
			entities: {},
		});
	});

	it('run REPLACE_ENTITIES (with array)', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntitiesWithArray },
				{
					type: REPLACE_ENTITIES,
					entityKey: 'entities',
					entities: {
						test: {
							1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
						},
					},
				},
			),
		).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
				},
			},
		});
	});

	it('run MERGE_ENTITIES (with array)', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntitiesWithArray },
				{
					type: MERGE_ENTITIES,
					entityKey: 'entities',
					entities: {
						test: {
							1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
						},
					},
				},
			),
		).toEqual({
			entities: {
				test: {
					1: {
						id: 1,
						value: false,
						anotherValue: true,
						list: [{ id: 1, value: false }, { id: 5, value: true }],
					},
					2: { id: 2, value: false, randomValue: 'hello', list: [{ id: 3, value: true }, { id: 4, value: true }] },
				},
			},
		});
	});

	it('run UPDATE_ENTITIES (with array)', () => {
		expect(
			entityReducer(
				{ entities: defaultObjectEntitiesWithArray },
				{
					type: UPDATE_ENTITIES,
					entityKey: 'entities',
					entities: {
						test: {
							1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] },
						},
					},
				},
			),
		).toEqual({
			entities: {
				test: {
					1: {
						id: 1,
						value: false,
						anotherValue: true,
						randomValue: 'test',
						list: [{ id: 1, value: false }, { id: 2, value: true }, { id: 5, value: true }],
					},
					2: { id: 2, value: false, randomValue: 'hello', list: [{ id: 3, value: true }, { id: 4, value: true }] },
				},
			},
		});
	});
});

describe('entity::makeUniqueArray', () => {
	it('should return same array if empty', () => {
		expect(makeUniqueArray([])).toEqual([]);
	});

	it('should return same array', () => {
		expect(makeUniqueArray([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	it('should return unique array', () => {
		expect(makeUniqueArray([1, 2, 3, 3, 4, 4, 5, 5, 6, 7])).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it('should remove refs if they are the same', () => {
		const sameRefObject = { 1: true };
		expect(makeUniqueArray([sameRefObject, sameRefObject, { 1: true }, { 1: false }])).toEqual([
			sameRefObject,
			{ 1: true },
			{ 1: false },
		]);
	});
});

describe('entity::isEntityOld', () => {
	it('should return true', () => {
		expect(isEntityOld({ requested_at: 12 }, { requested_at: 20 })).toBeTruthy();
	});

	it('should return false for same requested_at', () => {
		expect(isEntityOld({ requested_at: 20 }, { requested_at: 20 })).toBeFalsy();
	});

	it('should return false', () => {
		expect(isEntityOld({ requested_at: 22 }, { requested_at: 20 })).toBeFalsy();
	});

	it('should return false for non existent new entity', () => {
		expect(isEntityOld({}, { requested_at: 20 })).toBeFalsy();
	});
});

describe('entity::reset', () => {
	const state = {
		key: 'true',
		anotherKey: 'false',
		deepKey: {
			deepestKey: 'hello',
		},
	};

	it('State defaults to empty', () => {
		expect(reset()).toEqual({});
	});

	it('Should reset to state', () => {
		expect(reset(state)).toEqual(state);
	});

	it('Should add new key when resetting with non existing key', () => {
		expect(reset(state, 'nonExistantKey', {})).toEqual({ ...state, nonExistantKey: {} });
	});

	it('Should reset key to specified value', () => {
		expect(reset(state, 'anotherKey', 'blah')).toEqual({
			key: 'true',
			anotherKey: 'blah',
			deepKey: {
				deepestKey: 'hello',
			},
		});
	});

	it('Should reset deepKey to specified value', () => {
		expect(
			reset(state, 'deepKey', {
				deepestKey: 'blah',
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			deepKey: {
				deepestKey: 'blah',
			},
		});
	});

	const stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
		},
	};

	it('Should reset state with key value pairs', () => {
		expect(
			reset(stateWithID, 'myEntity', {
				3: { id: 3, value: false, newKey: 'test' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: false, newKey: 'test' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			},
		});
	});
});

describe('entity::remove', () => {
	const state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: true,
			2: true,
			3: true,
		},
	};

	it('State defaults to empty', () => {
		expect(remove()).toEqual({});
	});

	it('Should not remove anything', () => {
		expect(remove(state)).toEqual(state);
	});

	it('Should add the non existing key if it tries to remove something inside of it', () => {
		expect(remove(state, 'nonExistantKey', {})).toEqual({ ...state, nonExistantKey: {} });
	});

	it('Should remove key to specified values', () => {
		expect(remove(state, 'myEntity', { 1: true, 2: false })).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: true,
			},
		});
	});

	const stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
		},
	};

	it('Should remove specified values with id', () => {
		expect(
			remove(stateWithID, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test' },
				2: { id: 2, value: false, newKey: 'test' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: true, randomKey: 'hello' },
			},
		});
	});

	it('Should not remove keys when none provided (1)', () => {
		expect(remove(stateWithID, 'myEntity')).toEqual(stateWithID);
	});

	it('Should not remove keys when none provided (2)', () => {
		expect(remove(stateWithID, 'myEntity', {})).toEqual(stateWithID);
	});

	it('Should not remove keys when non-existing provided', () => {
		expect(remove(stateWithID, 'myEntity', { 4: { id: 4, value: true, newKey: 'test' } })).toEqual(stateWithID);
	});
});

describe('entity::replace', () => {
	const state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: true,
			2: true,
			3: true,
		},
	};

	it('State defaults to empty', () => {
		expect(replace()).toEqual({});
	});

	it('Should not replace anything', () => {
		expect(replace(state)).toEqual(state);
	});

	it('Should add the non existing key if it tries to remove something inside of it', () => {
		expect(remove(state, 'nonExistantKey', {})).toEqual({ ...state, nonExistantKey: {} });
	});

	it('Should replace key to specified values', () => {
		expect(replace(state, 'myEntity', { 1: false, 2: false })).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: false,
				2: false,
				3: true,
			},
		});
	});

	it('Should not replace keys when none provided (1)', () => {
		expect(replace(state, 'myEntity')).toEqual(state);
	});

	it('Should not replace keys when none provided (2)', () => {
		expect(replace(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not replace keys when non-existing provided', () => {
		expect(replace(state, 'myEntity', { 4: true })).toEqual({ ...state, myEntity: { ...state.myEntity, 4: true } });
	});

	const stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
		},
	};

	it('Should replace specified values with id', () => {
		expect(
			remove(stateWithID, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test' },
				2: { id: 2, value: false, newKey: 'test' },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: true, randomKey: 'hello' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			},
		});
	});
});

describe('entity::merge', () => {
	const state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
		},
	};

	it('State defaults to empty', () => {
		expect(merge()).toEqual({});
	});

	it('Should not merge anything', () => {
		expect(merge(state)).toEqual(state);
	});

	it('Should merge key to specified values', () => {
		expect(
			merge(state, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test' },
				2: { id: 2, value: false, newKey: 'test' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test' },
				2: { id: 2, value: false, randomKey: 'hello', newKey: 'test' },
				3: { id: 3, value: true, randomKey: 'hello' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			},
		});
	});

	it('Should not merge keys when none provided (1)', () => {
		expect(merge(state, 'myEntity')).toEqual(state);
	});

	it('Should not merge keys when none provided (2)', () => {
		expect(merge(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not merge keys when non-existing provided', () => {
		expect(merge(state, 'myEntity', { 4: { id: 4, value: true } })).toEqual({
			...state,
			myEntity: { ...state.myEntity, 4: { id: 4, value: true } },
		});
	});

	const stateWithRequestedAt = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello', requested_at: 10 },
			2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
			3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
		},
	};

	it('Should merge more recent key with specified values', () => {
		expect(
			merge(stateWithRequestedAt, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test', requested_at: 15 },
				2: { id: 2, value: false, newKey: 'test', requested_at: 5 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test', requested_at: 15 },
				2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
				3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			},
		});
	});

	const stateWithRelationships = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, relation_one: [1, 2, 3], relation_two: [1, 2], relation_three: [1, 2, 3] },
			2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3], relation_three: [1, 2, 4] },
			3: { id: 3, relation_one: [1, 2, 3], relation_two: [5, 6], relation_five: [6, 7, 8] },
		},
	};

	it('Should merge with specified values and relationships', () => {
		expect(
			merge(
				stateWithRelationships,
				'myEntity',
				{
					1: { id: 1, relation_one: [2, 3, 4], relation_two: [1, 3], relation_three: [] },
					2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3, 4, 5], relation_three: [8, 14] },
					3: {
						id: 3,
						relation_two: [5, 6],
						relation_three: [1, 2, 3],
						relation_four: [4, 5, 6],
						relation_five: [4, 5, 6],
					},
					4: { id: 2, value: false, newKey: 'test', requested_at: 20 },
				},
				['relation_one', 'relation_two', 'relation_three'],
			),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, relation_one: [1, 2, 3, 4], relation_two: [1, 2, 3], relation_three: [1, 2, 3] },
				2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3, 4, 5], relation_three: [1, 2, 4, 8, 14] },
				3: {
					id: 3,
					relation_one: [1, 2, 3],
					relation_two: [5, 6],
					relation_three: [1, 2, 3],
					relation_four: [4, 5, 6],
					relation_five: [4, 5, 6],
				},
				4: { id: 2, value: false, newKey: 'test', requested_at: 20 },
			},
		});
	});
});

describe('entity::updateProperty', () => {
	const objectProperty = {
		keyOne: true,
	};

	it('should not update object as no new property is found (1)', () => {
		expect(updateProperty('keyOne', objectProperty, undefined, updateProperty)).toEqual(objectProperty);
	});

	it('should not update object as no new property is found (2)', () => {
		expect(updateProperty('keyOne', objectProperty, {}, updateProperty)).toEqual(objectProperty);
	});

	it('should update object as new property is found', () => {
		expect(
			updateProperty(
				'keyOne',
				objectProperty,
				{
					keyOne: false,
				},
				updateProperty,
			),
		).toEqual({
			keyOne: false,
		});
	});

	const arrayProperty = [...objectProperty];

	it('should not update array as no new property is found (1)', () => {
		expect(updateProperty('keyOne', arrayProperty, undefined, updateProperty)).toEqual(arrayProperty);
	});

	it('should not update array as no new property is found (2)', () => {
		expect(updateProperty('keyOne', arrayProperty, [], updateProperty)).toEqual(arrayProperty);
	});

	it('should not update array as no new property is found (3)', () => {
		expect(updateProperty('keyOne', arrayProperty, {}, updateProperty)).toEqual(arrayProperty);
	});

	it('should update array to be empty object', () => {
		expect(updateProperty('keyOne', arrayProperty, [{}], updateProperty)).toEqual([{}]);
	});

	it('should update array as new property is found', () => {
		expect(
			updateProperty(
				'keyOne',
				arrayProperty,
				[
					{
						keyOne: false,
					},
				],
				updateProperty,
			),
		).toEqual([
			{
				keyOne: false,
			},
		]);
	});

	it('should not add primitive types to array if they already exist', () => {
		expect(updateProperty('keyOne', [1, 2, 3, 4], [1, 2, 3, 4], updateProperty)).toEqual([1, 2, 3, 4]);
	});

	it('should add primitive types to array if they dont exist', () => {
		expect(
			updateProperty('keyOne', [1, 2, undefined, 3, 4, undefined], [5, 6, 7, undefined, 8, undefined], updateProperty),
		).toEqual([1, 2, undefined, 3, 4, undefined, 5, 6, 7, 8]);
	});

	const entityLookingProperty = [
		{
			id: 1,
			value: true,
			otherKey: true,
		},
		{
			id: 2,
			value: true,
			otherKey: false,
		},
		{
			id: 3,
			value: true,
		},
	];

	it('should update entity figures with ID correctly', () => {
		expect(
			updateProperty(
				'keyOne',
				entityLookingProperty,
				[
					{
						id: 1,
						value: false,
						otherKey: false,
					},
					{
						id: 2,
						extraKey: 'hello',
						otherKey: undefined,
					},
					{
						id: 4,
						value: true,
					},
				],
				updateProperty,
			),
		).toEqual([
			{
				id: 1,
				value: false,
				otherKey: false,
			},
			{
				id: 2,
				value: true,
				extraKey: 'hello',
				otherKey: false,
			},
			{
				id: 3,
				value: true,
			},
			{
				id: 4,
				value: true,
			},
		]);
	});
});

describe('entity::update', () => {
	const state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
		},
	};

	it('State defaults to empty', () => {
		expect(update()).toEqual({});
	});

	it('Should not update anything', () => {
		expect(update(state)).toEqual(state);
	});

	it('Should update key to specified values', () => {
		expect(
			update(state, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test' },
				2: { id: 2, value: false, newKey: 'test' },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test' },
				2: { id: 2, value: false, randomKey: 'hello', newKey: 'test' },
				3: { id: 3, value: true, randomKey: 'hello' },
			},
		});
	});

	it('Should not update keys when none provided (1)', () => {
		expect(update(state, 'myEntity')).toEqual(state);
	});

	it('Should not update keys when none provided (2)', () => {
		expect(update(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not update keys when non-existing provided', () => {
		expect(update(state, 'myEntity', { 4: { id: 4, value: true } })).toEqual({
			...state,
			myEntity: { ...state.myEntity, 4: { id: 4, value: true } },
		});
	});

	const stateWithRequestedAt = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello', requested_at: 10 },
			2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
			3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
		},
	};

	it('Should update more recent key with specified values', () => {
		expect(
			update(stateWithRequestedAt, 'myEntity', {
				1: { id: 1, value: true, newKey: 'test', requested_at: 15 },
				2: { id: 2, value: false, newKey: 'test', requested_at: 5 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			}),
		).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test', requested_at: 15 },
				2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
				3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			},
		});
	});
});
