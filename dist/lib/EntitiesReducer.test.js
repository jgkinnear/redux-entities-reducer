'use strict';

var _EntitiesReducer = require('./EntitiesReducer');

var _EntitiesReducer2 = _interopRequireDefault(_EntitiesReducer);

var _EntitiesActionTypes = require('./EntitiesActionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = void 0;

describe('Reducer::Entities', function () {
	beforeEach(function () {
		reducer = (0, _EntitiesReducer2.default)();
	});

	it('Should return the initial state with no matching action', function () {
		expect(reducer({}, {})).toMatchObject({});
	});

	describe('update()', function () {
		it('should add entities when supplied', function () {
			var entities = {
				users: {
					1: {
						id: 1,
						name: 'user 1'
					}
				}
			};
			var result = reducer({ users: {} }, { type: _EntitiesActionTypes.UPDATE_ENTITIES, entities: entities });
			expect(result).toMatchObject(entities);
		});

		it('should update existing entity properties, while keeping ones not passed in', function () {
			var initialState = {
				users: {
					1: {
						id: 1,
						name: 'User 1',
						age: 20
					}
				}
			};

			var action = {
				type: _EntitiesActionTypes.UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							name: 'User 2'
						}
					}
				}
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						name: 'User 2',
						age: 20
					}
				}
			});
		});

		it('should add new properties, while keeping ones not passed in', function () {
			var initialState = {
				users: {
					1: {
						id: 1,
						name: 'User 1'
					}
				}
			};

			var action = {
				type: _EntitiesActionTypes.UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							last_name: 'User 1 Last Name'
						}
					}
				}
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						id: 1,
						name: 'User 1',
						last_name: 'User 1 Last Name'
					}
				}
			});
		});
	});
});