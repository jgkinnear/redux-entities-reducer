import Entity from './Entity';
import EntityController from './EntityController';
describe('Entity', () => {
	it('should create a new instance with the appropriate properties copied', () => {
		const context = new EntityController();
		const result = new Entity({
			context: context,
			key: 'books',
			relationships: {
				authors: 'authors',
			},
		});
		expect(result.key).toBe('books');
		expect(result.context).toBe(context);
		expect(result.relationships).toEqual({
			authors: 'authors',
		});
	});

	it('should allow a new reducer to be defined', () => {

		class Test extends Entity {
			reducer() {
				return 'override';
			}
		}

		const A = new Test();

		expect(A.reducer()).toBe('override');

	})
});
