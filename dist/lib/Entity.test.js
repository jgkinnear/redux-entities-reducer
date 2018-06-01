'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity2 = require('./Entity');

var _Entity3 = _interopRequireDefault(_Entity2);

var _EntityController = require('./EntityController');

var _EntityController2 = _interopRequireDefault(_EntityController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Entity', function () {
	it('should create a new instance with the appropriate properties copied', function () {
		var context = new _EntityController2.default();
		var result = new _Entity3.default({
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

	it('should allow a new reducer to be defined', function () {
		var Test = function (_Entity) {
			_inherits(Test, _Entity);

			function Test() {
				_classCallCheck(this, Test);

				return _possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).apply(this, arguments));
			}

			_createClass(Test, [{
				key: 'reducer',
				value: function reducer() {
					return 'override';
				}
			}]);

			return Test;
		}(_Entity3.default);

		var A = new Test();

		expect(A.reducer()).toBe('override');
	});
});