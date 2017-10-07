
import CreateEntityReducer from './EntitiesReducer';
import {UPDATE_ENTITIES} from './EntitiesActionTypes';

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
			let entities = {
				users: {
					1: {
						id: 1,
						name: 'jason'
					}
				}
			};
			let result = reducer({users: {}}, {type: UPDATE_ENTITIES, entities: entities});
			expect(result).toMatchObject(entities);
		});

		it('Should update existing entity properties, while keeping ones not passed in', () => {

			let initialState = {
				users: {
					1: {
						id: 1,
						name: 'Jason'
					}
				}
			};

			let action = {
				type: UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							name: 'Lily'
						}
					}
				}
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						name: 'Lily'
					}
				}
			});

		});

		it('Should add new properties, while keeping ones not passed in', () => {

			let initialState = {
				users: {
					1: {
						id: 1,
						name: 'Jason'
					}
				}
			};

			let action = {
				type: UPDATE_ENTITIES,
				entities: {
					users: {
						1: {
							last_name: 'Kinnear'
						}
					}
				}
			};

			expect(reducer(initialState, action)).toMatchObject({
				users: {
					1: {
						id: 1,
						name: 'Jason',
						last_name: 'Kinnear'
					}
				}
			});

		});
	});
});