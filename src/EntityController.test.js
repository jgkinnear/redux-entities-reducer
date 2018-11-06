import BuildEntity, { hasMany, hasOne } from './EntityController';
import Entity from './Entity';
import { schema } from 'normalizr';

describe('buildEntity', () => {
	let Entities;

	let book1 = {
		id: 1,
		name: 'Book1',
	};

	let book2 = {
		id: 2,
		name: 'Book2',
	};

	let author1 = {
		id: 1,
		name: 'Author1',
	};

	let author2 = {
		id: 2,
		name: 'Author2',
	};

	beforeEach(() => {
		Entities = new BuildEntity();
	});

	it('should add entity config keys', () => {
		Entities.register('book');
		expect(Entities._entityConfig.book).toEqual({
			key: 'book',
			relations: {},
			options: {},
		});
	});

	it('should get the entity when requested', () => {
		Entities.register('book');
		const entity = Entities.getEntity('book');
		expect(entity).toBeInstanceOf(Entity);
	});

	it('should create schemas when the Entities system is initialized', () => {
		Entities.register('book');
		Entities.init();
		expect(Entities._schemas.book).toBeInstanceOf(schema.Entity);
	});

	it('should normalize an array of entities', () => {
		Entities.register('book');
		Entities.init();
		const result = Entities.normalize('book', [book1, book2]);
		expect(result).toEqual({
			entities: {
				book: {
					1: book1,
					2: book2,
				},
			},
			result: [1, 2],
		});
	});

	it('should normalize an array of entities directly via the Entity', () => {
		Entities.register('book');
		Entities.init();
		const result = Entities.getEntity('book').normalize([book1, book2]);
		expect(result).toEqual({
			entities: {
				book: {
					1: book1,
					2: book2,
				},
			},
			result: [1, 2],
		});
	});

	it('should normalize an array of entities with relationships', () => {
		Entities.register('book', {
			author: hasOne('author'),
		});
		Entities.register('author');
		Entities.init();

		let denormalizedData = [{ ...book1, author: author1 }];

		expect(Entities.normalize('book', denormalizedData)).toEqual({
			entities: {
				book: {
					1: { ...book1, author: 1 },
				},
				author: {
					1: author1,
				},
			},
			result: [1],
		});
	});

	it('should normalize an array of entities with relationships that are m2m', () => {
		Entities.register('book', {
			authors: hasMany('author'),
		});
		Entities.register('author');
		Entities.init();

		let denormalizedData = [{ ...book1, authors: [author1, author2] }];

		expect(Entities.normalize('book', denormalizedData)).toEqual({
			entities: {
				book: {
					1: { ...book1, authors: [1, 2] },
				},
				author: {
					1: author1,
					2: author2,
				},
			},
			result: [1],
		});
	});

	it('should denormalize entities', () => {
		Entities.register('book');
		Entities.init();
		const result = Entities.denormalize('book', {
			book: {
				1: book1,
				2: book2,
			},
		});
		expect(result).toEqual([book1, book2]);
	});

	it('should denormalize filtered entities', () => {
		Entities.register('book');
		Entities.init();
		const result = Entities.denormalize(
			'book',
			{
				book: {
					1: book1,
					2: book2,
				},
			},
			[2],
		);
		expect(result).toEqual([book2]);
	});

	it('should attach an instance of an Entity to the controller', () => {
		class Book extends Entity {
			key = 'books';
			relations = {
				authors: hasOne('authors'),
			};
		}

		Entities.register(Book);

		expect(Entities.entities.books).toBeInstanceOf(Entity);
	});

	describe('allReducers', () => {
		it('should create an object of entity reducers', () => {
			Entities.register('book');
			Entities.register('author');

			const allReducers = Entities.allReducers();

			// Make sure the results are reducers
			expect(allReducers.book(1, {})).toBe(1);
			expect(allReducers.author({ a: 'a' }, {})).toEqual({ a: 'a' });
		});
	});
});
