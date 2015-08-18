(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["ImmutableValidation"] = factory(require("immutable"));
	else
		root["ImmutableValidation"] = factory(root["Immutable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Validator = __webpack_require__(1);

	var _Validator2 = _interopRequireDefault(_Validator);

	var _facts = __webpack_require__(3);

	var facts = _interopRequireWildcard(_facts);

	var _rule = __webpack_require__(4);

	var _rule2 = _interopRequireDefault(_rule);

	exports['default'] = {
	    Validator: _Validator2['default'],
	    facts: facts,
	    rule: _rule2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _immutable = __webpack_require__(2);

	var hasProp = Object.prototype.hasOwnProperty;

	var Validator = (function () {
	    function Validator() {
	        _classCallCheck(this, Validator);

	        this.ruleSets = [];

	        this.validationState = new _immutable.Map({
	            isValid: true,
	            messages: new _immutable.Map()
	        });
	    }

	    _createClass(Validator, [{
	        key: 'ruleFor',
	        value: function ruleFor(propName, accessor) {
	            for (var _len = arguments.length, rules = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                rules[_key - 2] = arguments[_key];
	            }

	            return rules.length === 1 && Validator.isInstance(rules[0]) ? this._addValidatorToRuleSets(propName, accessor, rules[0]) : this._addRuleSetToRuleSets(propName, accessor, rules);
	        }
	    }, {
	        key: '_addValidatorToRuleSets',
	        value: function _addValidatorToRuleSets(propName, accessor, validator) {
	            this.validationState = this.validationState.setIn(['messages', propName], new _immutable.Map());

	            this.ruleSets.push(function (dataToValidate, validationMessages) {
	                var val = accessor(dataToValidate, propName);
	                var validatorResult = validator.validate(val);
	                return validationMessages.set(propName, validatorResult);
	            });

	            return this;
	        }
	    }, {
	        key: '_addRuleSetToRuleSets',
	        value: function _addRuleSetToRuleSets(propName, accessor, rules) {
	            var _this = this;

	            this.validationState = this.validationState.setIn(['messages', propName], new _immutable.Set());

	            this.ruleSets.push(function (dataToValidate, validationMessages) {
	                return rules.reduce(function (allMessages, rule) {
	                    var messages = allMessages.get(propName);

	                    var val = accessor(dataToValidate, propName);

	                    var _runRule2 = _this._runRule(rule, val);

	                    var isValid = _runRule2.isValid;
	                    var message = _runRule2.message;

	                    return isValid ? allMessages.set(propName, messages['delete'](message)) : allMessages.set(propName, messages.add(message));
	                }, validationMessages);
	            });

	            return this;
	        }
	    }, {
	        key: '_runRule',
	        value: function _runRule(rule, val) {
	            var result = rule(val);
	            if (!hasProp.call(result, 'isValid') || !hasProp.call(result, 'message')) {
	                throw new Error('Validation rules must return a result object with the properties `isValid` and `message`');
	            }
	            return result;
	        }
	    }, {
	        key: 'validate',
	        value: function validate(dataToValidate) {
	            var newMessages = this.ruleSets.reduce(function (messages, ruleSet) {
	                return ruleSet(dataToValidate, messages);
	            }, this.validationState.get('messages'));

	            var isValid = newMessages.every(function (prop) {
	                return !prop.count();
	            });

	            this.validationState = this.validationState.withMutations(function (vState) {
	                return vState.set('isValid', isValid).set('messages', newMessages);
	            });

	            return this.validationState;
	        }
	    }], [{
	        key: 'isInstance',
	        value: function isInstance(obj) {
	            return typeof obj.validate === 'function' && typeof obj.ruleFor === 'function';
	        }
	    }, {
	        key: 'defaultGetter',
	        value: function defaultGetter(dataToValidate, propName) {
	            return dataToValidate.get(propName);
	        }
	    }]);

	    return Validator;
	})();

	exports['default'] = Validator;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.required = required;
	exports.minLength = minLength;
	exports.maxLength = maxLength;
	exports.between = between;

	function required(val) {
	    return !!val;
	}

	function minLength(min) {
	    return function (val) {
	        return val.length >= min;
	    };
	}

	function maxLength(max) {
	    return function (val) {
	        return val.length <= max;
	    };
	}

	function between(min, max) {
	    return function (val) {
	        var nVal = parseInt(val, 10);
	        return nVal >= min && nVal <= max;
	    };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = rule;

	function rule(fact, message) {
	    return function (val) {
	        var isValid = fact(val);
	        return { isValid: isValid, message: message };
	    };
	}

	module.exports = exports["default"];

/***/ }
/******/ ])
});
;