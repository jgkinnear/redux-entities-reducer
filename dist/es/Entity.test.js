'use strict';

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _EntityController = require('./EntityController');

var _EntityController2 = _interopRequireDefault(_EntityController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Entity', function () {

	it('should create a new instance with the appropriate properties copies', function () {
		var context = new _EntityController2.default();
		var result = new _Entity2.default({
			context: context,
			key: 'books',
			relationships: {
				authors: 'authors'
			}
		});
		expect(result.key).toBe('books');
		expect(result.context).toBe(context);
		expect(result.relationships).toEqual({
			authors: 'authors'
		});
	});
});