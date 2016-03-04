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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.rule = exports.predicates = exports.Validator = undefined;
	
	var _Validator = __webpack_require__(/*! ./Validator */ 1);
	
	Object.defineProperty(exports, 'Validator', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Validator).default;
	  }
	});
	
	var _rule = __webpack_require__(/*! ./rule */ 5);
	
	Object.defineProperty(exports, 'rule', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_rule).default;
	  }
	});
	
	var _predicates = __webpack_require__(/*! ./predicates */ 6);
	
	var predicates = _interopRequireWildcard(_predicates);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.predicates = predicates;

/***/ },
/* 1 */
/*!**************************!*\
  !*** ./src/Validator.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _immutable = __webpack_require__(/*! immutable */ 2);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _util = __webpack_require__(/*! ./util */ 3);
	
	var _ValidatorWrapper = __webpack_require__(/*! ./ValidatorWrapper */ 4);
	
	var _ValidatorWrapper2 = _interopRequireDefault(_ValidatorWrapper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var SELF = 'self';
	
	function buildRuleReducer(dataToValidate) {
	    return function (messagesForProp, rule) {
	        var _runRule = runRule(rule, dataToValidate);
	
	        var isValid = _runRule.isValid;
	        var message = _runRule.message;
	
	
	        if (!isValid) {
	            return messagesForProp.add(message);
	        }
	
	        return messagesForProp;
	    };
	}
	
	function resultReducer(isValid, _ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var prop = _ref2[1];
	
	    if (isValid === false) return false;
	    if (prop.has('isValid')) return prop.get('isValid');
	    if (prop.has(SELF) && prop.get(SELF).count()) return false;
	    return prop.entrySeq().filter(function (_ref3) {
	        var _ref4 = _slicedToArray(_ref3, 1);
	
	        var key = _ref4[0];
	        return key !== 'isValid' && key !== SELF;
	    }).reduce(resultReducer, isValid);
	}
	
	function runRule(rule, val) {
	    var result = rule(val);
	    if (!(0, _util.hasProp)(result, 'isValid') || !(0, _util.hasProp)(result, 'message')) {
	        throw new Error('Rules must return a result with the properties `isValid` and `message`. Use ImmutableValidation.rule()');
	    }
	    return result;
	}
	
	function iterableAccessor(propName, accessor, data) {
	    var iter = accessor(data);
	
	    if (!(0, _util.isIterable)(iter)) {
	        throw new TypeError('`' + propName + '` is a non-iterable value. ruleForEach applies a validation rule to each item in an iterable');
	    }
	
	    return iter;
	}
	
	function setMerged(vState, propName, newData) {
	    if (vState.has(propName)) {
	        newData = vState.get(propName).merge(newData);
	    }
	
	    return vState.set(propName, _immutable2.default.Map(newData));
	}
	
	function buildRuleSet(propName, accessor, rules) {
	    return function (data, vState) {
	        var existing = vState.getIn([propName, SELF]) || _immutable2.default.Set();
	        var ruleReducer = buildRuleReducer(accessor(data));
	        var messages = rules.reduce(ruleReducer, existing);
	        return vState.set(propName, _immutable2.default.Map(_defineProperty({}, SELF, messages)));
	    };
	}
	
	function buildRuleSetForValidator(propName, accessor, validator) {
	    return function (data, vState) {
	        var val = accessor(data);
	        var validatorResult = validator.validate(val);
	        return setMerged(vState, propName, validatorResult);
	    };
	}
	
	function buildRuleSetForEachValidator(propName, accessor, validator) {
	    return function (data, vState) {
	        var iter = iterableAccessor(propName, accessor, data);
	
	        var resultMap = iter.reduce(function (results, item, i) {
	            var validatorResult = validator.validate(item);
	            return results.set(i, validatorResult);
	        }, _immutable2.default.Map());
	
	        return setMerged(vState, propName, resultMap);
	    };
	}
	
	function buildRuleSetForEachItem(propName, accessor, rules) {
	    return function (data, vState) {
	        var iter = iterableAccessor(propName, accessor, data);
	
	        var resultMap = iter.reduce(function (results, item, i) {
	            var ruleReducer = buildRuleReducer(item);
	            var itemResult = rules.reduce(ruleReducer, _immutable2.default.Set());
	            return results.set(i, _immutable2.default.Map(_defineProperty({}, SELF, itemResult)));
	        }, _immutable2.default.Map());
	
	        return setMerged(vState, propName, resultMap);
	    };
	}
	
	function extendRuleSets(baseValidator, ruleSet) {
	    var extendedValidator = new Validator();
	    extendedValidator.ruleSets = baseValidator.ruleSets.concat(ruleSet);
	    return extendedValidator;
	}
	
	var Validator = function () {
	    function Validator() {
	        _classCallCheck(this, Validator);
	
	        this.ruleSets = [];
	        this.validationState = _immutable2.default.Map({
	            isValid: true
	        });
	    }
	
	    _createClass(Validator, [{
	        key: 'ruleFor',
	        value: function ruleFor(propName, accessor) {
	            for (var _len = arguments.length, rules = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                rules[_key - 2] = arguments[_key];
	            }
	
	            var ruleSet = Validator.isInstance(rules[0]) ? buildRuleSetForValidator(propName, accessor, rules[0]) : buildRuleSet(propName, accessor, rules);
	
	            return extendRuleSets(this, ruleSet);
	        }
	    }, {
	        key: 'ruleForEach',
	        value: function ruleForEach(propName, accessor) {
	            for (var _len2 = arguments.length, rules = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                rules[_key2 - 2] = arguments[_key2];
	            }
	
	            var ruleSet = Validator.isInstance(rules[0]) ? buildRuleSetForEachValidator(propName, accessor, rules[0]) : buildRuleSetForEachItem(propName, accessor, rules);
	
	            return extendRuleSets(this, ruleSet);
	        }
	    }, {
	        key: 'validate',
	        value: function validate(dataToValidate) {
	            var newVState = this.ruleSets.reduce(function (messages, ruleSet) {
	                return ruleSet(dataToValidate, messages);
	            }, _immutable2.default.Map());
	
	            var isValid = newVState.entrySeq().filter(function (_ref5) {
	                var _ref6 = _slicedToArray(_ref5, 1);
	
	                var key = _ref6[0];
	                return key !== 'isValid';
	            }).reduce(resultReducer, true);
	
	            this.validationState = newVState.set('isValid', isValid);
	
	            return this.validationState;
	        }
	    }], [{
	        key: 'isInstance',
	        value: function isInstance(obj) {
	            if (!obj) return false;
	            return (0, _util.isFunction)(obj.validate);
	        }
	    }, {
	        key: 'which',
	        value: function which(chooseValidator) {
	            if (!(0, _util.isFunction)(chooseValidator)) {
	                throw new TypeError('Call Validator.which with a function returning a validator or null');
	            }
	
	            return new _ValidatorWrapper2.default(chooseValidator);
	        }
	    }]);
	
	    return Validator;
	}();
	
	exports.default = Validator;

/***/ },
/* 2 */
/*!******************************************************************************************************!*\
  !*** external {"root":"Immutable","commonjs2":"immutable","commonjs":"immutable","amd":"immutable"} ***!
  \******************************************************************************************************/
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.identity = identity;
	exports.noop = noop;
	exports.toType = toType;
	exports.isFunction = isFunction;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isNumber = isNumber;
	exports.isBoolean = isBoolean;
	exports.partial = partial;
	exports.isIterable = isIterable;
	exports.iterableLength = iterableLength;
	exports.unwrapImmutable = unwrapImmutable;
	exports.get = get;
	exports.hasProp = hasProp;
	exports.asCallable = asCallable;
	function identity(x) {
	    return x;
	}
	
	function noop() {
	    return undefined;
	}
	
	function toType(obj) {
	    // IE requires some special-case handling, otherwise returns 'object' for both of the below
	    if (obj === null) return 'null';
	    if (obj === undefined) return 'undefined';
	    // Angus Croll (http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator)
	    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
	
	function isFunction(obj) {
	    return toType(obj) === 'function';
	}
	
	function isString(obj) {
	    return toType(obj) === 'string';
	}
	
	function isObject(obj) {
	    return toType(obj) === 'object';
	}
	
	function isNumber(obj) {
	    return toType(obj) === 'number';
	}
	
	function isBoolean(obj) {
	    return toType(obj) === 'boolean';
	}
	
	function partial(fn) {
	    for (var _len = arguments.length, argsToApply = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        argsToApply[_key - 1] = arguments[_key];
	    }
	
	    return function () {
	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }
	
	        return fn.apply(this, argsToApply.concat(args));
	    };
	}
	
	function isIterable(maybeIter) {
	    if (!maybeIter || (typeof maybeIter === 'undefined' ? 'undefined' : _typeof(maybeIter)) !== 'object') return false;
	    return 'length' in maybeIter || 'count' in maybeIter && isFunction(maybeIter.count);
	}
	
	function iterableLength(iter) {
	    if (!isIterable(iter)) return 0;
	    if (isFunction(iter.count)) return iter.count();
	    return iter.length;
	}
	
	function unwrapImmutable(maybeImmutable) {
	    if (!maybeImmutable) return maybeImmutable;
	    if (isFunction(maybeImmutable.toJS)) return maybeImmutable.toJS();
	    return maybeImmutable;
	}
	
	function get(maybeImmutable, propOrIndex) {
	    if (!maybeImmutable || (typeof maybeImmutable === 'undefined' ? 'undefined' : _typeof(maybeImmutable)) !== 'object') return maybeImmutable;
	    if (isFunction(maybeImmutable.get)) return maybeImmutable.get(propOrIndex);
	    return maybeImmutable[propOrIndex];
	}
	
	function hasProp(o, p) {
	    return Object.prototype.hasOwnProperty.call(o, p);
	}
	
	/**
	 * Ensures that the given argument can be called as a function:
	 *
	 *    var definitelyFn = asCallable(maybeFn);
	 *    definitelyFn(); // calling maybeFn would throw if maybeFn is not a function
	 *
	 * @param {*} maybeFn - value to ensure is callable
	 * @param {string|function} instead - function to call if maybeFn is not callable, OR the string 'identity' to return the value of maybeFn
	 * @returns {function}
	 */
	function asCallable(maybeFn, instead) {
	    if (isFunction(maybeFn)) return maybeFn;
	    if (isFunction(instead)) return partial(instead, maybeFn);
	    if (instead === 'identity') return partial(identity, maybeFn);
	    return noop;
	}

/***/ },
/* 4 */
/*!*********************************!*\
  !*** ./src/ValidatorWrapper.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _immutable = __webpack_require__(/*! immutable */ 2);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _Validator = __webpack_require__(/*! ./Validator */ 1);
	
	var _Validator2 = _interopRequireDefault(_Validator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ValidatorWrapper = function () {
	    function ValidatorWrapper(chooseValidator) {
	        _classCallCheck(this, ValidatorWrapper);
	
	        this.getValidator = chooseValidator;
	    }
	
	    _createClass(ValidatorWrapper, [{
	        key: 'validate',
	        value: function validate(dataToValidate) {
	            var v = this.getValidator(dataToValidate);
	
	            if (!_Validator2.default.isInstance(v)) {
	                return _immutable2.default.Map({ isValid: true });
	            }
	
	            return v.validate(dataToValidate);
	        }
	    }]);
	
	    return ValidatorWrapper;
	}();
	
	exports.default = ValidatorWrapper;

/***/ },
/* 5 */
/*!*********************!*\
  !*** ./src/rule.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = rule;
	
	var _util = __webpack_require__(/*! ./util */ 3);
	
	function rule(predicate, message) {
	    predicate = (0, _util.asCallable)(predicate, function () {
	        return true;
	    });
	    message = (0, _util.asCallable)(message, function (msg) {
	        return (0, _util.isString)(msg) ? msg : '';
	    });
	
	    return function (val) {
	        var isValid = predicate(val);
	        var msg = message(val);
	        return { isValid: isValid, message: msg };
	    };
	}

/***/ },
/* 6 */
/*!***************************!*\
  !*** ./src/predicates.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.required = required;
	exports.minLength = minLength;
	exports.maxLength = maxLength;
	exports.between = between;
	
	var _util = __webpack_require__(/*! ./util */ 3);
	
	function required(val) {
	    if (!(0, _util.isString)(val) && !(0, _util.isNumber)(val) && !(0, _util.isBoolean)(val)) return false;
	
	    if ((0, _util.isString)(val)) {
	        return val.trim().length > 0;
	    }
	
	    if (isNaN(val)) return false;
	
	    return true;
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
	
	// TODO: Curried functions
	function between(min, max) {
	    return function (val) {
	        var nVal = parseInt(val, 10);
	        return nVal >= min && nVal <= max;
	    };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ImmutableValidation.js.map