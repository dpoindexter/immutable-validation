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
	
	var _rule = __webpack_require__(/*! ./rule */ 39);
	
	Object.defineProperty(exports, 'rule', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_rule).default;
	  }
	});
	
	var _predicates = __webpack_require__(/*! ./predicates */ 40);
	
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
	
	var _immutable = __webpack_require__(/*! immutable */ 2);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _curry = __webpack_require__(/*! ramda/src/curry */ 3);
	
	var _curry2 = _interopRequireDefault(_curry);
	
	var _pipe = __webpack_require__(/*! ramda/src/pipe */ 10);
	
	var _pipe2 = _interopRequireDefault(_pipe);
	
	var _both = __webpack_require__(/*! ramda/src/both */ 23);
	
	var _both2 = _interopRequireDefault(_both);
	
	var _tap2 = __webpack_require__(/*! ramda/src/tap */ 24);
	
	var _tap3 = _interopRequireDefault(_tap2);
	
	var _util = __webpack_require__(/*! ./util */ 25);
	
	var _ValidatorWrapper = __webpack_require__(/*! ./ValidatorWrapper */ 35);
	
	var _ValidatorWrapper2 = _interopRequireDefault(_ValidatorWrapper);
	
	var _ValidationRecord = __webpack_require__(/*! ./ValidationRecord */ 36);
	
	var _ValidationRecord2 = _interopRequireDefault(_ValidationRecord);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MESSAGE = 'message';
	var RULES = 'rules';
	var IS_VALID = 'isValid';
	
	function assertRuleResult(result) {
	    var interfaceErr = new Error('Rules must return a result with the\n        properties `isValid` and `message`.\n        Use ImmutableValidation.rule()');
	    (0, _util.assert)((0, _both2.default)((0, _util.maybeHas)(IS_VALID), (0, _util.maybeHas)(MESSAGE))(result), interfaceErr);
	}
	
	function assertIterable(propName) {
	    var iterableErr = new TypeError('`' + propName + '` is a non-iterable value.\n        ruleForEach applies a validation rule to\n        each item in an iterable');
	    return function (obj) {
	        return (0, _util.assert)((0, _util.isIterable)(obj), iterableErr);
	    };
	}
	
	var reduceRules = (0, _curry2.default)(function (data, messagesForProp, rule) {
	    var _tap = (0, _tap3.default)(assertRuleResult, rule(data));
	
	    var isValid = _tap.isValid;
	    var message = _tap.message;
	
	    return !isValid ? messagesForProp.add(message) : messagesForProp;
	});
	
	var createResult = _ValidationRecord2.default.create;
	
	var evaluateRules = (0, _curry2.default)(function (rules, data) {
	    return rules.reduce(reduceRules(data), _immutable2.default.Set());
	});
	
	var evaluateValidator = (0, _curry2.default)(function (validator, data) {
	    return validator.validate(data);
	});
	
	var merge = (0, _curry2.default)(function (propName, vState, result) {
	    return result.mergeDeep(vState.getIn([RULES, propName]));
	});
	
	var setResult = (0, _curry2.default)(function (propName, vState, result) {
	    return vState.set(IS_VALID, vState.get('isValid') && result.get('isValid')).setIn([RULES, propName], result);
	});
	
	function buildRuleSet(propName, getData, rules) {
	    var evaluateData = evaluateRules(rules);
	    var mergeWithExisting = merge(propName);
	    var setForProp = setResult(propName);
	
	    return function (vState, data) {
	        return (0, _pipe2.default)(getData, evaluateData, createResult, mergeWithExisting(vState), setForProp(vState))(data);
	    };
	}
	
	function buildRuleSetForValidator(propName, getData, validator) {
	    var evaluateData = evaluateValidator(validator);
	    var mergeWithExisting = merge(propName);
	    var setForProp = setResult(propName);
	
	    return function (vState, data) {
	        return (0, _pipe2.default)(getData, evaluateData, mergeWithExisting(vState), setForProp(vState))(data);
	    };
	}
	
	function buildRuleSetForEachValidator(propName, getData, validator) {
	    return function (vState, data) {
	        var iter = (0, _tap3.default)(assertIterable(propName), getData(data));
	
	        var result = iter.reduce(function (record, item, i) {
	            return setResult(i, record, validator.validate(item));
	        }, createResult());
	
	        return setResult(propName, vState, result);
	    };
	}
	
	function buildRuleSetForEachItem(propName, getData, rules) {
	    var evaluateData = evaluateRules(rules);
	
	    return function (vState, data) {
	        var iter = (0, _tap3.default)(assertIterable(propName), getData(data));
	        var result = iter.reduce(function (record, item, i) {
	            return (0, _pipe2.default)(evaluateData, createResult, setResult(i, record))(item);
	        }, createResult());
	
	        return setResult(propName, vState, result);
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
	            this.validationState = this.ruleSets.reduce(function (messages, ruleSet) {
	                return ruleSet(messages, dataToValidate);
	            }, _ValidationRecord2.default.create());
	
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
/*!******************************!*\
  !*** ./~/ramda/src/curry.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(/*! ./internal/_curry1 */ 4);
	var curryN = __webpack_require__(/*! ./curryN */ 6);
	
	
	/**
	 * Returns a curried equivalent of the provided function. The curried function
	 * has two unusual capabilities. First, its arguments needn't be provided one
	 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
	 * following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value `R.__` may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
	 * following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (* -> a) -> (* -> a)
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curryN
	 * @example
	 *
	 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
	 *
	 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry1(function curry(fn) {
	  return curryN(fn.length, fn);
	});


/***/ },
/* 4 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_curry1.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var _isPlaceholder = __webpack_require__(/*! ./_isPlaceholder */ 5);
	
	
	/**
	 * Optimized internal one-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry1(fn) {
	  return function f1(a) {
	    if (arguments.length === 0 || _isPlaceholder(a)) {
	      return f1;
	    } else {
	      return fn.apply(this, arguments);
	    }
	  };
	};


/***/ },
/* 5 */
/*!************************************************!*\
  !*** ./~/ramda/src/internal/_isPlaceholder.js ***!
  \************************************************/
/***/ function(module, exports) {

	module.exports = function _isPlaceholder(a) {
	  return a != null &&
	         typeof a === 'object' &&
	         a['@@functional/placeholder'] === true;
	};


/***/ },
/* 6 */
/*!*******************************!*\
  !*** ./~/ramda/src/curryN.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(/*! ./internal/_arity */ 7);
	var _curry1 = __webpack_require__(/*! ./internal/_curry1 */ 4);
	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	var _curryN = __webpack_require__(/*! ./internal/_curryN */ 9);
	
	
	/**
	 * Returns a curried equivalent of the provided function, with the specified
	 * arity. The curried function has two unusual capabilities. First, its
	 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
	 * following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value `R.__` may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
	 * following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @since v0.5.0
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curry
	 * @example
	 *
	 *      var sumArgs = (...args) => R.sum(args);
	 *
	 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry2(function curryN(length, fn) {
	  if (length === 1) {
	    return _curry1(fn);
	  }
	  return _arity(length, _curryN(length, [], fn));
	});


/***/ },
/* 7 */
/*!****************************************!*\
  !*** ./~/ramda/src/internal/_arity.js ***!
  \****************************************/
/***/ function(module, exports) {

	module.exports = function _arity(n, fn) {
	  /* eslint-disable no-unused-vars */
	  switch (n) {
	    case 0: return function() { return fn.apply(this, arguments); };
	    case 1: return function(a0) { return fn.apply(this, arguments); };
	    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
	    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
	    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
	    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
	    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
	    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
	    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
	    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
	    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
	    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
	  }
	};


/***/ },
/* 8 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_curry2.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(/*! ./_curry1 */ 4);
	var _isPlaceholder = __webpack_require__(/*! ./_isPlaceholder */ 5);
	
	
	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry2(fn) {
	  return function f2(a, b) {
	    switch (arguments.length) {
	      case 0:
	        return f2;
	      case 1:
	        return _isPlaceholder(a) ? f2
	             : _curry1(function(_b) { return fn(a, _b); });
	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
	             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
	             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
	             : fn(a, b);
	    }
	  };
	};


/***/ },
/* 9 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_curryN.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(/*! ./_arity */ 7);
	var _isPlaceholder = __webpack_require__(/*! ./_isPlaceholder */ 5);
	
	
	/**
	 * Internal curryN function.
	 *
	 * @private
	 * @category Function
	 * @param {Number} length The arity of the curried function.
	 * @param {Array} received An array of arguments received thus far.
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curryN(length, received, fn) {
	  return function() {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;
	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;
	      if (combinedIdx < received.length &&
	          (!_isPlaceholder(received[combinedIdx]) ||
	           argsIdx >= arguments.length)) {
	        result = received[combinedIdx];
	      } else {
	        result = arguments[argsIdx];
	        argsIdx += 1;
	      }
	      combined[combinedIdx] = result;
	      if (!_isPlaceholder(result)) {
	        left -= 1;
	      }
	      combinedIdx += 1;
	    }
	    return left <= 0 ? fn.apply(this, combined)
	                     : _arity(left, _curryN(length, combined, fn));
	  };
	};


/***/ },
/* 10 */
/*!*****************************!*\
  !*** ./~/ramda/src/pipe.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(/*! ./internal/_arity */ 7);
	var _pipe = __webpack_require__(/*! ./internal/_pipe */ 11);
	var reduce = __webpack_require__(/*! ./reduce */ 12);
	var tail = __webpack_require__(/*! ./tail */ 19);
	
	
	/**
	 * Performs left-to-right function composition. The leftmost function may have
	 * any arity; the remaining functions must be unary.
	 *
	 * In some libraries this function is named `sequence`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
	 * @param {...Function} functions
	 * @return {Function}
	 * @see R.compose
	 * @example
	 *
	 *      var f = R.pipe(Math.pow, R.negate, R.inc);
	 *
	 *      f(3, 4); // -(3^4) + 1
	 */
	module.exports = function pipe() {
	  if (arguments.length === 0) {
	    throw new Error('pipe requires at least one argument');
	  }
	  return _arity(arguments[0].length,
	                reduce(_pipe, arguments[0], tail(arguments)));
	};


/***/ },
/* 11 */
/*!***************************************!*\
  !*** ./~/ramda/src/internal/_pipe.js ***!
  \***************************************/
/***/ function(module, exports) {

	module.exports = function _pipe(f, g) {
	  return function() {
	    return g.call(this, f.apply(this, arguments));
	  };
	};


/***/ },
/* 12 */
/*!*******************************!*\
  !*** ./~/ramda/src/reduce.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(/*! ./internal/_curry3 */ 13);
	var _reduce = __webpack_require__(/*! ./internal/_reduce */ 14);
	
	
	/**
	 * Returns a single item by iterating through the list, successively calling
	 * the iterator function and passing it an accumulator value and the current
	 * value from the array, and then passing the result to the next call.
	 *
	 * The iterator function receives two values: *(acc, value)*. It may use
	 * `R.reduced` to shortcut the iteration.
	 *
	 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
	 * arrays), unlike the native `Array.prototype.reduce` method. For more details
	 * on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	 *
	 * Dispatches to the `reduce` method of the third argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig ((a, b) -> a) -> a -> [b] -> a
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduced, R.addIndex
	 * @example
	 *
	 *      var numbers = [1, 2, 3];
	 *      var add = (a, b) => a + b;
	 *
	 *      R.reduce(add, 10, numbers); //=> 16
	 */
	module.exports = _curry3(_reduce);


/***/ },
/* 13 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_curry3.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(/*! ./_curry1 */ 4);
	var _curry2 = __webpack_require__(/*! ./_curry2 */ 8);
	var _isPlaceholder = __webpack_require__(/*! ./_isPlaceholder */ 5);
	
	
	/**
	 * Optimized internal three-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry3(fn) {
	  return function f3(a, b, c) {
	    switch (arguments.length) {
	      case 0:
	        return f3;
	      case 1:
	        return _isPlaceholder(a) ? f3
	             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
	      case 2:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
	             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
	             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
	             : _curry1(function(_c) { return fn(a, b, _c); });
	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
	             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
	             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
	             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
	             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
	             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
	             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
	             : fn(a, b, c);
	    }
	  };
	};


/***/ },
/* 14 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_reduce.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var _xwrap = __webpack_require__(/*! ./_xwrap */ 15);
	var bind = __webpack_require__(/*! ../bind */ 16);
	var isArrayLike = __webpack_require__(/*! ../isArrayLike */ 17);
	
	
	module.exports = (function() {
	  function _arrayReduce(xf, acc, list) {
	    var idx = 0;
	    var len = list.length;
	    while (idx < len) {
	      acc = xf['@@transducer/step'](acc, list[idx]);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      idx += 1;
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _iterableReduce(xf, acc, iter) {
	    var step = iter.next();
	    while (!step.done) {
	      acc = xf['@@transducer/step'](acc, step.value);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      step = iter.next();
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _methodReduce(xf, acc, obj) {
	    return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
	  }
	
	  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
	  return function _reduce(fn, acc, list) {
	    if (typeof fn === 'function') {
	      fn = _xwrap(fn);
	    }
	    if (isArrayLike(list)) {
	      return _arrayReduce(fn, acc, list);
	    }
	    if (typeof list.reduce === 'function') {
	      return _methodReduce(fn, acc, list);
	    }
	    if (list[symIterator] != null) {
	      return _iterableReduce(fn, acc, list[symIterator]());
	    }
	    if (typeof list.next === 'function') {
	      return _iterableReduce(fn, acc, list);
	    }
	    throw new TypeError('reduce: list must be array or iterable');
	  };
	}());


/***/ },
/* 15 */
/*!****************************************!*\
  !*** ./~/ramda/src/internal/_xwrap.js ***!
  \****************************************/
/***/ function(module, exports) {

	module.exports = (function() {
	  function XWrap(fn) {
	    this.f = fn;
	  }
	  XWrap.prototype['@@transducer/init'] = function() {
	    throw new Error('init not implemented on XWrap');
	  };
	  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
	  XWrap.prototype['@@transducer/step'] = function(acc, x) {
	    return this.f(acc, x);
	  };
	
	  return function _xwrap(fn) { return new XWrap(fn); };
	}());


/***/ },
/* 16 */
/*!*****************************!*\
  !*** ./~/ramda/src/bind.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(/*! ./internal/_arity */ 7);
	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * Creates a function that is bound to a context.
	 * Note: `R.bind` does not provide the additional argument-binding capabilities of
	 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category Function
	 * @category Object
	 * @sig (* -> *) -> {*} -> (* -> *)
	 * @param {Function} fn The function to bind to context
	 * @param {Object} thisObj The context to bind `fn` to
	 * @return {Function} A function that will execute in the context of `thisObj`.
	 * @see R.partial
	 */
	module.exports = _curry2(function bind(fn, thisObj) {
	  return _arity(fn.length, function() {
	    return fn.apply(thisObj, arguments);
	  });
	});


/***/ },
/* 17 */
/*!************************************!*\
  !*** ./~/ramda/src/isArrayLike.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(/*! ./internal/_curry1 */ 4);
	var _isArray = __webpack_require__(/*! ./internal/_isArray */ 18);
	
	
	/**
	 * Tests whether or not an object is similar to an array.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.5.0
	 * @category Type
	 * @category List
	 * @sig * -> Boolean
	 * @param {*} x The object to test.
	 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
	 * @example
	 *
	 *      R.isArrayLike([]); //=> true
	 *      R.isArrayLike(true); //=> false
	 *      R.isArrayLike({}); //=> false
	 *      R.isArrayLike({length: 10}); //=> false
	 *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
	 */
	module.exports = _curry1(function isArrayLike(x) {
	  if (_isArray(x)) { return true; }
	  if (!x) { return false; }
	  if (typeof x !== 'object') { return false; }
	  if (x instanceof String) { return false; }
	  if (x.nodeType === 1) { return !!x.length; }
	  if (x.length === 0) { return true; }
	  if (x.length > 0) {
	    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	  }
	  return false;
	});


/***/ },
/* 18 */
/*!******************************************!*\
  !*** ./~/ramda/src/internal/_isArray.js ***!
  \******************************************/
/***/ function(module, exports) {

	/**
	 * Tests whether or not an object is an array.
	 *
	 * @private
	 * @param {*} val The object to test.
	 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
	 * @example
	 *
	 *      _isArray([]); //=> true
	 *      _isArray(null); //=> false
	 *      _isArray({}); //=> false
	 */
	module.exports = Array.isArray || function _isArray(val) {
	  return (val != null &&
	          val.length >= 0 &&
	          Object.prototype.toString.call(val) === '[object Array]');
	};


/***/ },
/* 19 */
/*!*****************************!*\
  !*** ./~/ramda/src/tail.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(/*! ./internal/_checkForMethod */ 20);
	var slice = __webpack_require__(/*! ./slice */ 22);
	
	
	/**
	 * Returns all but the first element of the given list or string (or object
	 * with a `tail` method).
	 *
	 * Dispatches to the `slice` method of the first argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @see R.head, R.init, R.last
	 * @example
	 *
	 *      R.tail([1, 2, 3]);  //=> [2, 3]
	 *      R.tail([1, 2]);     //=> [2]
	 *      R.tail([1]);        //=> []
	 *      R.tail([]);         //=> []
	 *
	 *      R.tail('abc');  //=> 'bc'
	 *      R.tail('ab');   //=> 'b'
	 *      R.tail('a');    //=> ''
	 *      R.tail('');     //=> ''
	 */
	module.exports = _checkForMethod('tail', slice(1, Infinity));


/***/ },
/* 20 */
/*!*************************************************!*\
  !*** ./~/ramda/src/internal/_checkForMethod.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(/*! ./_isArray */ 18);
	var _slice = __webpack_require__(/*! ./_slice */ 21);
	
	
	/**
	 * Similar to hasMethod, this checks whether a function has a [methodname]
	 * function. If it isn't an array it will execute that function otherwise it
	 * will default to the ramda implementation.
	 *
	 * @private
	 * @param {Function} fn ramda implemtation
	 * @param {String} methodname property to check for a custom implementation
	 * @return {Object} Whatever the return value of the method is.
	 */
	module.exports = function _checkForMethod(methodname, fn) {
	  return function() {
	    var length = arguments.length;
	    if (length === 0) {
	      return fn();
	    }
	    var obj = arguments[length - 1];
	    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
	      fn.apply(this, arguments) :
	      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
	  };
	};


/***/ },
/* 21 */
/*!****************************************!*\
  !*** ./~/ramda/src/internal/_slice.js ***!
  \****************************************/
/***/ function(module, exports) {

	/**
	 * An optimized, private array `slice` implementation.
	 *
	 * @private
	 * @param {Arguments|Array} args The array or arguments object to consider.
	 * @param {Number} [from=0] The array index to slice from, inclusive.
	 * @param {Number} [to=args.length] The array index to slice to, exclusive.
	 * @return {Array} A new, sliced array.
	 * @example
	 *
	 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
	 *
	 *      var firstThreeArgs = function(a, b, c, d) {
	 *        return _slice(arguments, 0, 3);
	 *      };
	 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
	 */
	module.exports = function _slice(args, from, to) {
	  switch (arguments.length) {
	    case 1: return _slice(args, 0, args.length);
	    case 2: return _slice(args, from, args.length);
	    default:
	      var list = [];
	      var idx = 0;
	      var len = Math.max(0, Math.min(args.length, to) - from);
	      while (idx < len) {
	        list[idx] = args[from + idx];
	        idx += 1;
	      }
	      return list;
	  }
	};


/***/ },
/* 22 */
/*!******************************!*\
  !*** ./~/ramda/src/slice.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(/*! ./internal/_checkForMethod */ 20);
	var _curry3 = __webpack_require__(/*! ./internal/_curry3 */ 13);
	
	
	/**
	 * Returns the elements of the given list or string (or object with a `slice`
	 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
	 *
	 * Dispatches to the `slice` method of the third argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.4
	 * @category List
	 * @sig Number -> Number -> [a] -> [a]
	 * @sig Number -> Number -> String -> String
	 * @param {Number} fromIndex The start index (inclusive).
	 * @param {Number} toIndex The end index (exclusive).
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
	 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
	 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
	 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
	 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
	 */
	module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
	  return Array.prototype.slice.call(list, fromIndex, toIndex);
	}));


/***/ },
/* 23 */
/*!*****************************!*\
  !*** ./~/ramda/src/both.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * A function wrapping calls to the two functions in an `&&` operation,
	 * returning the result of the first function if it is false-y and the result
	 * of the second function otherwise. Note that this is short-circuited,
	 * meaning that the second function will not be invoked if the first returns a
	 * false-y value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f a predicate
	 * @param {Function} g another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
	 * @see R.and
	 * @example
	 *
	 *      var gt10 = x => x > 10;
	 *      var even = x => x % 2 === 0;
	 *      var f = R.both(gt10, even);
	 *      f(100); //=> true
	 *      f(101); //=> false
	 */
	module.exports = _curry2(function both(f, g) {
	  return function _both() {
	    return f.apply(this, arguments) && g.apply(this, arguments);
	  };
	});


/***/ },
/* 24 */
/*!****************************!*\
  !*** ./~/ramda/src/tap.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * Runs the given function with the supplied object, then returns the object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (a -> *) -> a -> a
	 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
	 * @param {*} x
	 * @return {*} `x`.
	 * @example
	 *
	 *      var sayX = x => console.log('x is ' + x);
	 *      R.tap(sayX, 100); //=> 100
	 *      //-> 'x is 100'
	 */
	module.exports = _curry2(function tap(fn, x) {
	  fn(x);
	  return x;
	});


/***/ },
/* 25 */
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isIterable = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.noop = noop;
	exports.isFunction = isFunction;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isNumber = isNumber;
	exports.isBoolean = isBoolean;
	exports.maybeHas = maybeHas;
	exports.iterableLength = iterableLength;
	exports.unwrapImmutable = unwrapImmutable;
	exports.get = get;
	exports.assert = assert;
	exports.assertFor = assertFor;
	exports.liftToArray = liftToArray;
	exports.asCallable = asCallable;
	
	var _type = __webpack_require__(/*! ramda/src/type */ 26);
	
	var _type2 = _interopRequireDefault(_type);
	
	var _partial = __webpack_require__(/*! ramda/src/partial */ 27);
	
	var _partial2 = _interopRequireDefault(_partial);
	
	var _has = __webpack_require__(/*! ramda/src/has */ 30);
	
	var _has2 = _interopRequireDefault(_has);
	
	var _hasIn = __webpack_require__(/*! ramda/src/hasIn */ 32);
	
	var _hasIn2 = _interopRequireDefault(_hasIn);
	
	var _both = __webpack_require__(/*! ramda/src/both */ 23);
	
	var _both2 = _interopRequireDefault(_both);
	
	var _is = __webpack_require__(/*! ramda/src/is */ 33);
	
	var _is2 = _interopRequireDefault(_is);
	
	var _either = __webpack_require__(/*! ramda/src/either */ 34);
	
	var _either2 = _interopRequireDefault(_either);
	
	var _isArrayLike = __webpack_require__(/*! ramda/src/isArrayLike */ 17);
	
	var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function noop() {
	    return undefined;
	}
	
	function isFunction(obj) {
	    return (0, _type2.default)(obj) === 'Function';
	}
	
	function isString(obj) {
	    return (0, _type2.default)(obj) === 'String';
	}
	
	function isObject(obj) {
	    return (0, _type2.default)(obj) === 'Object';
	}
	
	function isNumber(obj) {
	    return (0, _type2.default)(obj) === 'Number';
	}
	
	function isBoolean(obj) {
	    return (0, _type2.default)(obj) === 'Boolean';
	}
	
	function maybeHas(prop) {
	    return (0, _both2.default)((0, _is2.default)(Object), (0, _has2.default)(prop));
	}
	
	var isIterable = exports.isIterable = (0, _both2.default)((0, _is2.default)(Object), (0, _either2.default)((0, _hasIn2.default)('length'), (0, _hasIn2.default)('size')));
	
	function iterableLength(iter) {
	    if (!isIterable(iter)) return 0;
	    if (iter.size) return iter.size;
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
	
	function assert(expr, err) {
	    if (!expr) throw err;
	}
	
	function assertFor(predicate, err, val) {
	    assert(predicate(val), err);
	    return val;
	}
	
	function liftToArray(val) {
	    return (0, _isArrayLike2.default)(val) ? val : [val];
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
	    if (isFunction(instead)) return (0, _partial2.default)(instead, [maybeFn]);
	    return noop;
	}

/***/ },
/* 26 */
/*!*****************************!*\
  !*** ./~/ramda/src/type.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(/*! ./internal/_curry1 */ 4);
	
	
	/**
	 * Gives a single-word string description of the (native) type of a value,
	 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
	 * attempt to distinguish user Object types any further, reporting them all as
	 * 'Object'.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Type
	 * @sig (* -> {*}) -> String
	 * @param {*} val The value to test
	 * @return {String}
	 * @example
	 *
	 *      R.type({}); //=> "Object"
	 *      R.type(1); //=> "Number"
	 *      R.type(false); //=> "Boolean"
	 *      R.type('s'); //=> "String"
	 *      R.type(null); //=> "Null"
	 *      R.type([]); //=> "Array"
	 *      R.type(/[A-z]/); //=> "RegExp"
	 */
	module.exports = _curry1(function type(val) {
	  return val === null      ? 'Null'      :
	         val === undefined ? 'Undefined' :
	         Object.prototype.toString.call(val).slice(8, -1);
	});


/***/ },
/* 27 */
/*!********************************!*\
  !*** ./~/ramda/src/partial.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(/*! ./internal/_concat */ 28);
	var _createPartialApplicator = __webpack_require__(/*! ./internal/_createPartialApplicator */ 29);
	
	
	/**
	 * Takes a function `f` and a list of arguments, and returns a function `g`.
	 * When applied, `g` returns the result of applying `f` to the arguments
	 * provided initially followed by the arguments provided to `g`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Function
	 * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
	 * @param {Function} f
	 * @param {Array} args
	 * @return {Function}
	 * @see R.partialRight
	 * @example
	 *
	 *      var multiply = (a, b) => a * b;
	 *      var double = R.partial(multiply, [2]);
	 *      double(2); //=> 4
	 *
	 *      var greet = (salutation, title, firstName, lastName) =>
	 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	 *
	 *      var sayHello = R.partial(greet, ['Hello']);
	 *      var sayHelloToMs = R.partial(sayHello, ['Ms.']);
	 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
	 */
	module.exports = _createPartialApplicator(_concat);


/***/ },
/* 28 */
/*!*****************************************!*\
  !*** ./~/ramda/src/internal/_concat.js ***!
  \*****************************************/
/***/ function(module, exports) {

	/**
	 * Private `concat` function to merge two array-like objects.
	 *
	 * @private
	 * @param {Array|Arguments} [set1=[]] An array-like object.
	 * @param {Array|Arguments} [set2=[]] An array-like object.
	 * @return {Array} A new, merged array.
	 * @example
	 *
	 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	 */
	module.exports = function _concat(set1, set2) {
	  set1 = set1 || [];
	  set2 = set2 || [];
	  var idx;
	  var len1 = set1.length;
	  var len2 = set2.length;
	  var result = [];
	
	  idx = 0;
	  while (idx < len1) {
	    result[result.length] = set1[idx];
	    idx += 1;
	  }
	  idx = 0;
	  while (idx < len2) {
	    result[result.length] = set2[idx];
	    idx += 1;
	  }
	  return result;
	};


/***/ },
/* 29 */
/*!**********************************************************!*\
  !*** ./~/ramda/src/internal/_createPartialApplicator.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(/*! ./_arity */ 7);
	var _curry2 = __webpack_require__(/*! ./_curry2 */ 8);
	
	
	module.exports = function _createPartialApplicator(concat) {
	  return _curry2(function(fn, args) {
	    return _arity(Math.max(0, fn.length - args.length), function() {
	      return fn.apply(this, concat(args, arguments));
	    });
	  });
	};


/***/ },
/* 30 */
/*!****************************!*\
  !*** ./~/ramda/src/has.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	var _has = __webpack_require__(/*! ./internal/_has */ 31);
	
	
	/**
	 * Returns whether or not an object has an own property with the specified name
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Object
	 * @sig s -> {s: x} -> Boolean
	 * @param {String} prop The name of the property to check for.
	 * @param {Object} obj The object to query.
	 * @return {Boolean} Whether the property exists.
	 * @example
	 *
	 *      var hasName = R.has('name');
	 *      hasName({name: 'alice'});   //=> true
	 *      hasName({name: 'bob'});     //=> true
	 *      hasName({});                //=> false
	 *
	 *      var point = {x: 0, y: 0};
	 *      var pointHas = R.has(R.__, point);
	 *      pointHas('x');  //=> true
	 *      pointHas('y');  //=> true
	 *      pointHas('z');  //=> false
	 */
	module.exports = _curry2(_has);


/***/ },
/* 31 */
/*!**************************************!*\
  !*** ./~/ramda/src/internal/_has.js ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = function _has(prop, obj) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	};


/***/ },
/* 32 */
/*!******************************!*\
  !*** ./~/ramda/src/hasIn.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * Returns whether or not an object or its prototype chain has a property with
	 * the specified name
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Object
	 * @sig s -> {s: x} -> Boolean
	 * @param {String} prop The name of the property to check for.
	 * @param {Object} obj The object to query.
	 * @return {Boolean} Whether the property exists.
	 * @example
	 *
	 *      function Rectangle(width, height) {
	 *        this.width = width;
	 *        this.height = height;
	 *      }
	 *      Rectangle.prototype.area = function() {
	 *        return this.width * this.height;
	 *      };
	 *
	 *      var square = new Rectangle(2, 2);
	 *      R.hasIn('width', square);  //=> true
	 *      R.hasIn('area', square);  //=> true
	 */
	module.exports = _curry2(function hasIn(prop, obj) {
	  return prop in obj;
	});


/***/ },
/* 33 */
/*!***************************!*\
  !*** ./~/ramda/src/is.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * See if an object (`val`) is an instance of the supplied constructor. This
	 * function will check up the inheritance chain, if any.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Type
	 * @sig (* -> {*}) -> a -> Boolean
	 * @param {Object} ctor A constructor
	 * @param {*} val The value to test
	 * @return {Boolean}
	 * @example
	 *
	 *      R.is(Object, {}); //=> true
	 *      R.is(Number, 1); //=> true
	 *      R.is(Object, 1); //=> false
	 *      R.is(String, 's'); //=> true
	 *      R.is(String, new String('')); //=> true
	 *      R.is(Object, new String('')); //=> true
	 *      R.is(Object, 's'); //=> false
	 *      R.is(Number, {}); //=> false
	 */
	module.exports = _curry2(function is(Ctor, val) {
	  return val != null && val.constructor === Ctor || val instanceof Ctor;
	});


/***/ },
/* 34 */
/*!*******************************!*\
  !*** ./~/ramda/src/either.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * A function wrapping calls to the two functions in an `||` operation,
	 * returning the result of the first function if it is truth-y and the result
	 * of the second function otherwise. Note that this is short-circuited,
	 * meaning that the second function will not be invoked if the first returns a
	 * truth-y value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f a predicate
	 * @param {Function} g another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
	 * @see R.or
	 * @example
	 *
	 *      var gt10 = x => x > 10;
	 *      var even = x => x % 2 === 0;
	 *      var f = R.either(gt10, even);
	 *      f(101); //=> true
	 *      f(8); //=> true
	 */
	module.exports = _curry2(function either(f, g) {
	  return function _either() {
	    return f.apply(this, arguments) || g.apply(this, arguments);
	  };
	});


/***/ },
/* 35 */
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
/* 36 */
/*!*********************************!*\
  !*** ./src/ValidationRecord.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _immutable = __webpack_require__(/*! immutable */ 2);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _intersperse = __webpack_require__(/*! ramda/src/intersperse */ 37);
	
	var _intersperse2 = _interopRequireDefault(_intersperse);
	
	var _prepend = __webpack_require__(/*! ramda/src/prepend */ 38);
	
	var _prepend2 = _interopRequireDefault(_prepend);
	
	var _util = __webpack_require__(/*! ./util */ 25);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var RULES = 'rules';
	
	var ValidationRecord = function (_Imm$Record) {
	    _inherits(ValidationRecord, _Imm$Record);
	
	    function ValidationRecord() {
	        _classCallCheck(this, ValidationRecord);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(ValidationRecord).apply(this, arguments));
	    }
	
	    _createClass(ValidationRecord, [{
	        key: 'refine',
	        value: function refine(path) {
	            path = (0, _util.liftToArray)(path);
	            var actualPath = (0, _prepend2.default)(RULES, (0, _intersperse2.default)(RULES, path));
	            return this.getIn(actualPath);
	        }
	    }]);
	
	    return ValidationRecord;
	}(_immutable2.default.Record({
	    isValid: true,
	    rules: _immutable2.default.Map(),
	    messages: _immutable2.default.Set()
	}));
	
	ValidationRecord.create = function (messages) {
	    return new ValidationRecord({
	        isValid: messages ? messages.isEmpty() : true,
	        messages: messages
	    });
	};
	
	exports.default = ValidationRecord;

/***/ },
/* 37 */
/*!************************************!*\
  !*** ./~/ramda/src/intersperse.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(/*! ./internal/_checkForMethod */ 20);
	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * Creates a new list with the separator interposed between elements.
	 *
	 * Dispatches to the `intersperse` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} separator The element to add to the list.
	 * @param {Array} list The list to be interposed.
	 * @return {Array} The new list.
	 * @example
	 *
	 *      R.intersperse('n', ['ba', 'a', 'a']); //=> ['ba', 'n', 'a', 'n', 'a']
	 */
	module.exports = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
	  var out = [];
	  var idx = 0;
	  var length = list.length;
	  while (idx < length) {
	    if (idx === length - 1) {
	      out.push(list[idx]);
	    } else {
	      out.push(list[idx], separator);
	    }
	    idx += 1;
	  }
	  return out;
	}));


/***/ },
/* 38 */
/*!********************************!*\
  !*** ./~/ramda/src/prepend.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(/*! ./internal/_concat */ 28);
	var _curry2 = __webpack_require__(/*! ./internal/_curry2 */ 8);
	
	
	/**
	 * Returns a new list with the given element at the front, followed by the
	 * contents of the list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} el The item to add to the head of the output list.
	 * @param {Array} list The array to add to the tail of the output list.
	 * @return {Array} A new array.
	 * @see R.append
	 * @example
	 *
	 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
	 */
	module.exports = _curry2(function prepend(el, list) {
	  return _concat([el], list);
	});


/***/ },
/* 39 */
/*!*********************!*\
  !*** ./src/rule.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = rule;
	
	var _util = __webpack_require__(/*! ./util */ 25);
	
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
/* 40 */
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
	
	var _util = __webpack_require__(/*! ./util */ 25);
	
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