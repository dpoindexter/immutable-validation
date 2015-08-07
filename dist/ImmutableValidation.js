var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ImmutableValidation = factory();
})(this, function () {
    'use strict';

    var facts = Object.defineProperties({}, {
        required: {
            get: function get() {
                return required;
            },
            configurable: true,
            enumerable: true
        },
        minLength: {
            get: function get() {
                return minLength;
            },
            configurable: true,
            enumerable: true
        },
        maxLength: {
            get: function get() {
                return maxLength;
            },
            configurable: true,
            enumerable: true
        },
        between: {
            get: function get() {
                return between;
            },
            configurable: true,
            enumerable: true
        }
    });

    function rule(fact, message) {
        return function (val) {
            var isValid = fact(val);
            return { isValid: isValid, message: message };
        };
    }

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

    var Validator = (function () {
        function Validator() {
            _classCallCheck(this, Validator);

            this.ruleSets = [];

            this.validationState = new Immutable.Map({
                isValid: true,
                messages: new Immutable.Map()
            });
        }

        _createClass(Validator, [{
            key: 'ruleFor',
            value: function ruleFor(propName, accessor) {
                for (var _len = arguments.length, rules = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    rules[_key - 2] = arguments[_key];
                }

                this.validationState = this.validationState.setIn(['messages', propName], new Immutable.Set());

                this.ruleSets.push(function (dataToValidate, validationMessages) {
                    return rules.reduce(function (allMessages, rule) {
                        var messages = allMessages.get(propName);

                        var val = accessor(dataToValidate);

                        var _rule = rule(val);

                        var isValid = _rule.isValid;
                        var message = _rule.message;

                        return isValid ? allMessages.set(propName, messages['delete'](message)) : allMessages.set(propName, messages.add(message));
                    }, validationMessages);
                });

                return this;
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
        }]);

        return Validator;
    })();

    var validation = {
        Validator: Validator,
        facts: facts,
        rule: rule
    };

    return validation;
});