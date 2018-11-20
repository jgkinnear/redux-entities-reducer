'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _EntitiesActionTypes = require('./EntitiesActionTypes');

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe('entity::entity', function () {
	it('should return a function', function () {
		expect((0, _EntityReducer2.default)()).toBeInstanceOf(Function);
	});

	it('should throw an error if types missing', function () {
		expect(function () {
			return (0, _EntityReducer2.default)([], [_EntitiesActionTypes.MERGE_ENTITIES, _EntitiesActionTypes.REMOVE_ENTITIES]);
		}).toThrowError('Entity reducers required 5 types [Reset, Replace, Merge, Remove, and Update]');
	});
});

describe('entity::entityReducer', function () {
	var entityReducer = (0, _EntityReducer2.default)();
	var defaultObjectEntities = {
		test: { 1: { id: 1, value: true, randomValue: 'test' }, 2: { id: 2, value: false, randomValue: 'hello' } }
	};
	var defaultObjectEntitiesWithArray = {
		test: {
			1: {
				id: 1,
				value: true,
				randomValue: 'test',
				list: [{
					id: 1,
					value: true
				}, { id: 2, value: true }]
			},
			2: {
				id: 2,
				value: false,
				randomValue: 'hello',
				list: [{
					id: 3,
					value: true
				}, { id: 4, value: true }]
			}
		}
	};

	it('should return state when action type missing', function () {
		expect(entityReducer(defaultObjectEntities, {})).toEqual(defaultObjectEntities);
	});

	it('should throw an error if entityKey missing', function () {
		expect(function () {
			return entityReducer(undefined, { type: 'test' });
		}).toThrowError('An `entityKey` must exist to reduce an entity of any sort');
	});

	it('should throw an error if entityKey missing from state', function () {
		expect(function () {
			return entityReducer(undefined, { type: 'test', entityKey: 'entities' });
		}).toThrowError('entities does not exist in state. There must be an initial state object set for every available entity');
	});

	it('run RESET_ENTITIES', function () {
		expect(entityReducer({ entities: defaultObjectEntities }, {
			type: _EntitiesActionTypes.RESET_ENTITIES,
			entityKey: 'entities',
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		})).toEqual({
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		});
	});

	it('run REMOVE_ENTITIES', function () {
		expect(entityReducer({ entities: defaultObjectEntities }, {
			type: _EntitiesActionTypes.REMOVE_ENTITIES,
			entityKey: 'entities',
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		})).toEqual({
			entities: {}
		});
	});

	it('run REPLACE_ENTITIES', function () {
		expect(entityReducer({ entities: defaultObjectEntities }, {
			type: _EntitiesActionTypes.REPLACE_ENTITIES,
			entityKey: 'entities',
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		})).toEqual({
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		});
	});

	it('run MERGE_ENTITIES', function () {
		expect(entityReducer({ entities: defaultObjectEntities }, {
			type: _EntitiesActionTypes.MERGE_ENTITIES,
			entityKey: 'entities',
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		})).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true },
					2: { id: 2, value: false, randomValue: 'hello' }
				}
			}
		});
	});

	it('run UPDATE_ENTITIES', function () {
		expect(entityReducer({ entities: defaultObjectEntities }, {
			type: _EntitiesActionTypes.UPDATE_ENTITIES,
			entityKey: 'entities',
			entities: { test: { 1: { id: 1, value: false, anotherValue: true } } }
		})).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, randomValue: 'test' },
					2: { id: 2, value: false, randomValue: 'hello' }
				}
			}
		});
	});

	it('run RESET_ENTITIES (with array)', function () {
		expect(entityReducer({ entities: defaultObjectEntitiesWithArray }, {
			type: _EntitiesActionTypes.RESET_ENTITIES,
			entityKey: 'entities',
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		})).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		});
	});

	it('run REMOVE_ENTITIES (with array)', function () {
		expect(entityReducer({ entities: defaultObjectEntitiesWithArray }, {
			type: _EntitiesActionTypes.REMOVE_ENTITIES,
			entityKey: 'entities',
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		})).toEqual({
			entities: {}
		});
	});

	it('run REPLACE_ENTITIES (with array)', function () {
		expect(entityReducer({ entities: defaultObjectEntitiesWithArray }, {
			type: _EntitiesActionTypes.REPLACE_ENTITIES,
			entityKey: 'entities',
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		})).toEqual({
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		});
	});

	it('run MERGE_ENTITIES (with array)', function () {
		expect(entityReducer({ entities: defaultObjectEntitiesWithArray }, {
			type: _EntitiesActionTypes.MERGE_ENTITIES,
			entityKey: 'entities',
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		})).toEqual({
			entities: {
				test: {
					1: {
						id: 1,
						value: false,
						anotherValue: true,
						list: [{ id: 1, value: false }, { id: 5, value: true }]
					},
					2: { id: 2, value: false, randomValue: 'hello', list: [{ id: 3, value: true }, { id: 4, value: true }] }
				}
			}
		});
	});

	it('run UPDATE_ENTITIES (with array)', function () {
		expect(entityReducer({ entities: defaultObjectEntitiesWithArray }, {
			type: _EntitiesActionTypes.UPDATE_ENTITIES,
			entityKey: 'entities',
			entities: {
				test: {
					1: { id: 1, value: false, anotherValue: true, list: [{ id: 1, value: false }, { id: 5, value: true }] }
				}
			}
		})).toEqual({
			entities: {
				test: {
					1: {
						id: 1,
						value: false,
						anotherValue: true,
						randomValue: 'test',
						list: [{ id: 1, value: false }, { id: 2, value: true }, { id: 5, value: true }]
					},
					2: { id: 2, value: false, randomValue: 'hello', list: [{ id: 3, value: true }, { id: 4, value: true }] }
				}
			}
		});
	});
});

describe('entity::makeUniqueArray', function () {
	it('should return same array if empty', function () {
		expect((0, _EntityReducer.makeUniqueArray)([])).toEqual([]);
	});

	it('should return same array', function () {
		expect((0, _EntityReducer.makeUniqueArray)([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	it('should return unique array', function () {
		expect((0, _EntityReducer.makeUniqueArray)([1, 2, 3, 3, 4, 4, 5, 5, 6, 7])).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it('should remove refs if they are the same', function () {
		var sameRefObject = { 1: true };
		expect((0, _EntityReducer.makeUniqueArray)([sameRefObject, sameRefObject, { 1: true }, { 1: false }])).toEqual([sameRefObject, { 1: true }, { 1: false }]);
	});
});

describe('entity::isEntityOld', function () {
	it('should return true', function () {
		expect((0, _EntityReducer.isEntityOld)({ requested_at: 12 }, { requested_at: 20 })).toBeTruthy();
	});

	it('should return false for same requested_at', function () {
		expect((0, _EntityReducer.isEntityOld)({ requested_at: 20 }, { requested_at: 20 })).toBeFalsy();
	});

	it('should return false', function () {
		expect((0, _EntityReducer.isEntityOld)({ requested_at: 22 }, { requested_at: 20 })).toBeFalsy();
	});

	it('should return false for non existent new entity', function () {
		expect((0, _EntityReducer.isEntityOld)({}, { requested_at: 20 })).toBeFalsy();
	});
});

describe('entity::reset', function () {
	var state = {
		key: 'true',
		anotherKey: 'false',
		deepKey: {
			deepestKey: 'hello'
		}
	};

	it('State defaults to empty', function () {
		expect((0, _EntityReducer.reset)()).toEqual({});
	});

	it('Should reset to state', function () {
		expect((0, _EntityReducer.reset)(state)).toEqual(state);
	});

	it('Should add new key when resetting with non existing key', function () {
		expect((0, _EntityReducer.reset)(state, 'nonExistantKey', {})).toEqual(_extends({}, state, { nonExistantKey: {} }));
	});

	it('Should reset key to specified value', function () {
		expect((0, _EntityReducer.reset)(state, 'anotherKey', 'blah')).toEqual({
			key: 'true',
			anotherKey: 'blah',
			deepKey: {
				deepestKey: 'hello'
			}
		});
	});

	it('Should reset deepKey to specified value', function () {
		expect((0, _EntityReducer.reset)(state, 'deepKey', {
			deepestKey: 'blah'
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			deepKey: {
				deepestKey: 'blah'
			}
		});
	});

	var stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' }
		}
	};

	it('Should reset state with key value pairs', function () {
		expect((0, _EntityReducer.reset)(stateWithID, 'myEntity', {
			3: { id: 3, value: false, newKey: 'test' },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: false, newKey: 'test' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
			}
		});
	});
});

describe('entity::remove', function () {
	var state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: true,
			2: true,
			3: true
		}
	};

	it('State defaults to empty', function () {
		expect((0, _EntityReducer.remove)()).toEqual({});
	});

	it('Should not remove anything', function () {
		expect((0, _EntityReducer.remove)(state)).toEqual(state);
	});

	it('Should add the non existing key if it tries to remove something inside of it', function () {
		expect((0, _EntityReducer.remove)(state, 'nonExistantKey', {})).toEqual(_extends({}, state, { nonExistantKey: {} }));
	});

	it('Should remove key to specified values', function () {
		expect((0, _EntityReducer.remove)(state, 'myEntity', { 1: true, 2: false })).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: true
			}
		});
	});

	var stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' }
		}
	};

	it('Should remove specified values with id', function () {
		expect((0, _EntityReducer.remove)(stateWithID, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test' },
			2: { id: 2, value: false, newKey: 'test' },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: true, randomKey: 'hello' }
			}
		});
	});

	it('Should not remove keys when none provided (1)', function () {
		expect((0, _EntityReducer.remove)(stateWithID, 'myEntity')).toEqual(stateWithID);
	});

	it('Should not remove keys when none provided (2)', function () {
		expect((0, _EntityReducer.remove)(stateWithID, 'myEntity', {})).toEqual(stateWithID);
	});

	it('Should not remove keys when non-existing provided', function () {
		expect((0, _EntityReducer.remove)(stateWithID, 'myEntity', { 4: { id: 4, value: true, newKey: 'test' } })).toEqual(stateWithID);
	});
});

describe('entity::replace', function () {
	var state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: true,
			2: true,
			3: true
		}
	};

	it('State defaults to empty', function () {
		expect((0, _EntityReducer.replace)()).toEqual({});
	});

	it('Should not replace anything', function () {
		expect((0, _EntityReducer.replace)(state)).toEqual(state);
	});

	it('Should add the non existing key if it tries to remove something inside of it', function () {
		expect((0, _EntityReducer.remove)(state, 'nonExistantKey', {})).toEqual(_extends({}, state, { nonExistantKey: {} }));
	});

	it('Should replace key to specified values', function () {
		expect((0, _EntityReducer.replace)(state, 'myEntity', { 1: false, 2: false })).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: false,
				2: false,
				3: true
			}
		});
	});

	it('Should not replace keys when none provided (1)', function () {
		expect((0, _EntityReducer.replace)(state, 'myEntity')).toEqual(state);
	});

	it('Should not replace keys when none provided (2)', function () {
		expect((0, _EntityReducer.replace)(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not replace keys when non-existing provided', function () {
		expect((0, _EntityReducer.replace)(state, 'myEntity', { 4: true })).toEqual(_extends({}, state, { myEntity: _extends({}, state.myEntity, { 4: true }) }));
	});

	var stateWithID = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		}
	};

	it('Should replace specified values with id', function () {
		expect((0, _EntityReducer.remove)(stateWithID, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test' },
			2: { id: 2, value: false, newKey: 'test' }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				3: { id: 3, value: true, randomKey: 'hello' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
			}
		});
	});
});

describe('entity::merge', function () {
	var state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' }
		}
	};

	it('State defaults to empty', function () {
		expect((0, _EntityReducer.merge)()).toEqual({});
	});

	it('Should not merge anything', function () {
		expect((0, _EntityReducer.merge)(state)).toEqual(state);
	});

	it('Should merge key to specified values', function () {
		expect((0, _EntityReducer.merge)(state, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test' },
			2: { id: 2, value: false, newKey: 'test' },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test' },
				2: { id: 2, value: false, randomKey: 'hello', newKey: 'test' },
				3: { id: 3, value: true, randomKey: 'hello' },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
			}
		});
	});

	it('Should not merge keys when none provided (1)', function () {
		expect((0, _EntityReducer.merge)(state, 'myEntity')).toEqual(state);
	});

	it('Should not merge keys when none provided (2)', function () {
		expect((0, _EntityReducer.merge)(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not merge keys when non-existing provided', function () {
		expect((0, _EntityReducer.merge)(state, 'myEntity', { 4: { id: 4, value: true } })).toEqual(_extends({}, state, {
			myEntity: _extends({}, state.myEntity, { 4: { id: 4, value: true } })
		}));
	});

	var stateWithRequestedAt = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello', requested_at: 10 },
			2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
			3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 }
		}
	};

	it('Should merge more recent key with specified values', function () {
		expect((0, _EntityReducer.merge)(stateWithRequestedAt, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test', requested_at: 15 },
			2: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test', requested_at: 15 },
				2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
				3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
			}
		});
	});

	var stateWithRelationships = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, relation_one: [1, 2, 3], relation_two: [1, 2], relation_three: [1, 2, 3] },
			2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3], relation_three: [1, 2, 4] },
			3: { id: 3, relation_one: [1, 2, 3], relation_two: [5, 6], relation_five: [6, 7, 8] }
		}
	};

	it('Should merge with specified values and relationships', function () {
		expect((0, _EntityReducer.merge)(stateWithRelationships, 'myEntity', {
			1: { id: 1, relation_one: [2, 3, 4], relation_two: [1, 3], relation_three: [] },
			2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3, 4, 5], relation_three: [8, 14] },
			3: {
				id: 3,
				relation_two: [5, 6],
				relation_three: [1, 2, 3],
				relation_four: [4, 5, 6],
				relation_five: [4, 5, 6]
			},
			4: { id: 2, value: false, newKey: 'test', requested_at: 20 }
		}, ['relation_one', 'relation_two', 'relation_three'])).toEqual({
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
					relation_five: [4, 5, 6]
				},
				4: { id: 2, value: false, newKey: 'test', requested_at: 20 }
			}
		});
	});

	it('Should return exact same reference when merging exact same struct', function () {
		var mergeResult = (0, _EntityReducer.merge)(stateWithRelationships, 'myEntity', {
			1: { id: 1, relation_one: [2, 3, 4], relation_two: [1, 3], relation_three: [] },
			2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3, 4, 5], relation_three: [8, 14] },
			3: {
				id: 3,
				relation_two: [5, 6],
				relation_three: [1, 2, 3],
				relation_four: [4, 5, 6],
				relation_five: [4, 5, 6]
			},
			4: { id: 2, value: false, newKey: 'test', requested_at: 20 }
		}, ['relation_one', 'relation_two', 'relation_three']);

		var mergeResult2 = (0, _EntityReducer.merge)(mergeResult, 'myEntity', {
			1: { id: 1, relation_one: [2, 3, 4], relation_two: [1, 3], relation_three: [] },
			2: { id: 2, relation_one: [1, 2, 3], relation_two: [2, 3, 4, 5], relation_three: [8, 14] },
			3: {
				id: 3,
				relation_two: [5, 6],
				relation_three: [1, 2, 3],
				relation_four: [4, 5, 6],
				relation_five: [4, 5, 6]
			},
			4: { id: 2, value: false, newKey: 'test', requested_at: 20 }
		}, ['relation_one', 'relation_two', 'relation_three']);

		expect(mergeResult).toBe(mergeResult2);
	});
});

describe('entity::updateProperty', function () {
	var objectProperty = {
		keyOne: true
	};

	it('should not update object as no new property is found (1)', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', objectProperty, undefined, _EntityReducer.updateProperty)).toEqual(objectProperty);
	});

	it('should not update object as no new property is found (2)', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', objectProperty, {}, _EntityReducer.updateProperty)).toEqual(objectProperty);
	});

	it('should update object as new property is found', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', objectProperty, {
			keyOne: false
		}, _EntityReducer.updateProperty)).toEqual({
			keyOne: false
		});
	});

	var arrayProperty = [].concat(_toConsumableArray(objectProperty));

	it('should not update array as no new property is found (1)', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', arrayProperty, undefined, _EntityReducer.updateProperty)).toEqual(arrayProperty);
	});

	it('should not update array as no new property is found (2)', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', arrayProperty, [], _EntityReducer.updateProperty)).toEqual(arrayProperty);
	});

	it('should not update array as no new property is found (3)', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', arrayProperty, {}, _EntityReducer.updateProperty)).toEqual(arrayProperty);
	});

	it('should update array to be empty object', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', arrayProperty, [{}], _EntityReducer.updateProperty)).toEqual([{}]);
	});

	it('should update array as new property is found', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', arrayProperty, [{
			keyOne: false
		}], _EntityReducer.updateProperty)).toEqual([{
			keyOne: false
		}]);
	});

	it('should not add primitive types to array if they already exist', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', [1, 2, 3, 4], [1, 2, 3, 4], _EntityReducer.updateProperty)).toEqual([1, 2, 3, 4]);
	});

	it('should add primitive types to array if they dont exist', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', [1, 2, undefined, 3, 4, undefined], [5, 6, 7, undefined, 8, undefined], _EntityReducer.updateProperty)).toEqual([1, 2, undefined, 3, 4, undefined, 5, 6, 7, 8]);
	});

	var entityLookingProperty = [{
		id: 1,
		value: true,
		otherKey: true
	}, {
		id: 2,
		value: true,
		otherKey: false
	}, {
		id: 3,
		value: true
	}];

	it('should update entity figures with ID correctly', function () {
		expect((0, _EntityReducer.updateProperty)('keyOne', entityLookingProperty, [{
			id: 1,
			value: false,
			otherKey: false
		}, {
			id: 2,
			extraKey: 'hello',
			otherKey: undefined
		}, {
			id: 4,
			value: true
		}], _EntityReducer.updateProperty)).toEqual([{
			id: 1,
			value: false,
			otherKey: false
		}, {
			id: 2,
			value: true,
			extraKey: 'hello',
			otherKey: false
		}, {
			id: 3,
			value: true
		}, {
			id: 4,
			value: true
		}]);
	});
});

describe('entity::update', function () {
	var state = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello' },
			2: { id: 2, value: true, randomKey: 'hello' },
			3: { id: 3, value: true, randomKey: 'hello' }
		}
	};

	it('State defaults to empty', function () {
		expect((0, _EntityReducer.update)()).toEqual({});
	});

	it('Should not update anything', function () {
		expect((0, _EntityReducer.update)(state)).toEqual(state);
	});

	it('Should update key to specified values', function () {
		expect((0, _EntityReducer.update)(state, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test' },
			2: { id: 2, value: false, newKey: 'test' }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test' },
				2: { id: 2, value: false, randomKey: 'hello', newKey: 'test' },
				3: { id: 3, value: true, randomKey: 'hello' }
			}
		});
	});

	it('Should not update keys when none provided (1)', function () {
		expect((0, _EntityReducer.update)(state, 'myEntity')).toEqual(state);
	});

	it('Should not update keys when none provided (2)', function () {
		expect((0, _EntityReducer.update)(state, 'myEntity', {})).toEqual(state);
	});

	it('Should not update keys when non-existing provided', function () {
		expect((0, _EntityReducer.update)(state, 'myEntity', { 4: { id: 4, value: true } })).toEqual(_extends({}, state, {
			myEntity: _extends({}, state.myEntity, { 4: { id: 4, value: true } })
		}));
	});

	var stateWithRequestedAt = {
		key: 'true',
		anotherKey: 'false',
		myEntity: {
			1: { id: 1, value: true, randomKey: 'hello', requested_at: 10 },
			2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
			3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 }
		}
	};

	it('Should update more recent key with specified values', function () {
		expect((0, _EntityReducer.update)(stateWithRequestedAt, 'myEntity', {
			1: { id: 1, value: true, newKey: 'test', requested_at: 15 },
			2: { id: 2, value: false, newKey: 'test', requested_at: 5 },
			4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
		})).toEqual({
			key: 'true',
			anotherKey: 'false',
			myEntity: {
				1: { id: 1, value: true, randomKey: 'hello', newKey: 'test', requested_at: 15 },
				2: { id: 2, value: true, randomKey: 'hello', requested_at: 10 },
				3: { id: 3, value: true, randomKey: 'hello', requested_at: 10 },
				4: { id: 2, value: false, newKey: 'test', requested_at: 5 }
			}
		});
	});
});