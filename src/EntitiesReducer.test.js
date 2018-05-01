import CreateEntityReducer from './EntitiesReducer';
import { UPDATE_ENTITIES } from './EntitiesActionTypes';

let reducer;

describe('Reducer::Entities', () => {
	beforeEach(() => {
		reducer = CreateEntityReducer();
	});

	it('Should return the initial state with no matching action', () => {
		expect(reducer({}, {})).toMatchObject({});
	});

	describe('update()', () => {
		it('should add entities when supplied', () => {
			const entities = {
				users: {
					1: {
						id: 1,
						name: 'user 1',
					},
				},
			};
			const result = reducer({ users: {} }, { type: UPDATE_ENTITIES, entities: entities });
			expect(result).toMatchObject(entities);
		});

		it('should update existing entity properties, while keeping ones not passed in', () => {
			let initialState = {
				users: {
					1: {
						id: 1,
						name: 'User 1',
						age: 20,
					},
				},
			};

			let action = {
				type: UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							name: 'User 2',
						},
					},
				},
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						name: 'User 2',
						age: 20,
					},
				},
			});
		});

		it('should add new properties, while keeping ones not passed in', () => {
			let initialState = {
				users: {
					1: {
						id: 1,
						name: 'User 1',
					},
				},
			};

			let action = {
				type: UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							last_name: 'User 1 Last Name',
						},
					},
				},
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						id: 1,
						name: 'User 1',
						last_name: 'User 1 Last Name',
					},
				},
			});
		});
	});
});
