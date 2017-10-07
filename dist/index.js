'use strict';

var _EntitiesReducer = require('./EntitiesReducer');

var _EntitiesReducer2 = _interopRequireDefault(_EntitiesReducer);

var _EntityReducer = require('./EntityReducer');

var _EntityReducer2 = _interopRequireDefault(_EntityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
	EntityReducer: _EntityReducer2.default, EntitiesReducer: _EntitiesReducer2.default
};