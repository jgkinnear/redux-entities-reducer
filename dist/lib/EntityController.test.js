'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _EntityController = require('./EntityController');

var _EntityController2 = _interopRequireDefault(_EntityController);

var _Entity2 = require('./Entity');

var _Entity3 = _interopRequireDefault(_Entity2);

var _normalizr = require('normalizr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('buildEntity', function () {

	var Entities = void 0;

	var book1 = {
		id: 1, name: 'Book1'
	};

	var book2 = {
		id: 2, name: 'Book2'
	};

	var author1 = {
		id: 1, name: 'Author1'
	};

	var author2 = {
		id: 2, name: 'Author2'
	};

	beforeEach(function () {
		Entities = new _EntityController2.default();
	});

	it('should add entity config keys', function () {
		Entities.register('book');
		expect(Entities._entityConfig.book).toEqual({
			key: 'book',
			relations: {},
			options: {}
		});
	});

	it('should create schemas when the Entities system is initialized', function () {
		Entities.register('book');
		Entities.init();
		expect(Entities._schemas.book).toBeInstanceOf(_normalizr.schema.Entity);
	});

	it('should normalize an array of entities', function () {
		Entities.register('book');
		Entities.init();
		var result = Entities.normalize('book', [book1, book2]);
		expect(result).toEqual({
			entities: {
				book: {
					1: book1,
					2: book2
				}
			},
			result: [1, 2]
		});
	});

	it('should normalize an array of entities with relationships', function () {
		Entities.register('book', {
			author: (0, _EntityController.hasOne)('author')
		});
		Entities.register('author');
		Entities.init();

		var denormalizedData = [_extends({}, book1, { author: author1 })];

		expect(Entities.normalize('book', denormalizedData)).toEqual({
			entities: {
				book: {
					1: _extends({}, book1, { author: 1 })
				},
				author: {
					1: author1
				}
			},
			result: [1]
		});
	});

	it('should normalize an array of entities with relationships that are m2m', function () {
		Entities.register('book', {
			authors: (0, _EntityController.hasMany)('author')
		});
		Entities.register('author');
		Entities.init();

		var denormalizedData = [_extends({}, book1, { authors: [author1, author2] })];

		expect(Entities.normalize('book', denormalizedData)).toEqual({
			entities: {
				book: {
					1: _extends({}, book1, { authors: [1, 2] })
				},
				author: {
					1: author1,
					2: author2
				}
			},
			result: [1]
		});
	});

	it('should denormalize entities', function () {
		Entities.register('book');
		Entities.init();
		var result = Entities.denormalize('book', { book: {
				1: book1,
				2: book2
			} });
		expect(result).toEqual([book1, book2]);
	});

	it('should attach an instance of an Entity to the controller', function () {
		var Book = function (_Entity) {
			_inherits(Book, _Entity);

			function Book() {
				var _ref;

				var _temp, _this, _ret;

				_classCallCheck(this, Book);

				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Book.__proto__ || Object.getPrototypeOf(Book)).call.apply(_ref, [this].concat(args))), _this), _this.key = 'books', _this.relations = {
					authors: (0, _EntityController.hasOne)('authors')
				}, _temp), _possibleConstructorReturn(_this, _ret);
			}

			return Book;
		}(_Entity3.default);

		Entities.register(Book);

		expect(Entities.entities.books).toBeInstanceOf(_Entity3.default);
	});

	describe('allReducers', function () {
		it('should create an object of entity reducers', function () {
			Entities.register('book');
			Entities.register('author');

			var allReducers = Entities.allReducers();

			// Make sure the results are reducers
			expect(allReducers.book(1, {})).toBe(1);
			expect(allReducers.author({ a: 'a' }, {})).toEqual({ a: 'a' });
		});
	});
});