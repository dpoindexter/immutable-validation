import { Map, Set } from 'immutable';
import { isFunction, isIterable, iterableLength, get } from './util';

const hasProp = Object.prototype.hasOwnProperty;
const SELF = 'self';

function buildRuleReducer (dataToValidate) {
    return (messagesForProp, rule) => {
        const { isValid, message } = runRule(rule, dataToValidate);

        if (!isValid) {
            return messagesForProp.add(message);
        }

        return messagesForProp;
    }
}

function resultReducer (isValid, [ , prop ]) {
    if (isValid === false) return false;
    if (prop.has('isValid')) return prop.get('isValid');
    if (prop.has(SELF) && prop.get(SELF).count()) return false;
    return prop.entrySeq()
        .filter(([ key ]) => key !== 'isValid' && key !== SELF)
        .reduce(resultReducer, isValid);
}

function runRule (rule, val) {
    const result = rule(val);
    if (!hasProp.call(result, 'isValid') || !hasProp.call(result, 'message')) {
        throw new Error('Rules must return a result with the properties `isValid` and `message`. Use ImmutableValidation.rule()');
    }
    return result;
}

function getIterable (propName, accessor, data) {
    const iter = accessor(data);

    if (!isIterable(iter)) {
        throw new TypeError(`\`${propName}\` is a non-iterable value. ruleForEach applies a validation rule to each item in an iterable`);               
    }

    return iter;
}

function setMerged (vState, propName, newData) {
    if (vState.has(propName)) {
        newData = vState.get(propName).merge(newData);
    }

    return vState.set(propName, Map(newData));
}

class ValidatorWrapper {
    constructor (chooseValidator) {
        this.getValidator = chooseValidator;
    }

    validate (dataToValidate) {
        const v = this.getValidator(dataToValidate);

        if (!Validator.isInstance(v)) {
            return Map({ isValid: true });
        }

        return v.validate(dataToValidate);
    }
}

class Validator {
    constructor () {
        this.ruleSets = [];
        this.validationState = Map({
            isValid: true
        });
    }

    ruleFor (propName, accessor, ...rules) {
        return (Validator.isInstance(rules[0]))
            ? this._addValidatorToRuleSets(propName, accessor, rules[0])
            : this._addRuleSetToRuleSets(propName, accessor, rules);
    }

    ruleForEach (propName, accessor, ...rules) {
        return (Validator.isInstance(rules[0]))
            ? this._addForEachValidatorToRuleSets(propName, accessor, rules[0])
            : this._addForEachRuleSetToRuleSets(propName, accessor, rules);
    }

    validate (dataToValidate) {
        const newVState = this.ruleSets.reduce((messages, ruleSet) =>
            ruleSet(dataToValidate, messages), Map());

        const isValid = newVState.entrySeq()
            .filter(([ key ]) => key !== 'isValid')
            .reduce(resultReducer, true);

        this.validationState = newVState.set('isValid', isValid);

        return this.validationState;
    }

    _addValidatorToRuleSets (propName, accessor, validator) {
        this.ruleSets.push((data, vState) => {
            const val = accessor(data);
            const validatorResult = validator.validate(val);
            return setMerged(vState, propName, validatorResult);
        });

        return this;
    }

    _addRuleSetToRuleSets (propName, accessor, rules) {
        this.ruleSets.push((data, vState) => {
            const existing = vState.getIn([ propName, SELF ]) || Set();
            const ruleReducer = buildRuleReducer(accessor(data));
            const messages = rules.reduce(ruleReducer, existing);
            return vState.set(propName, Map({ [SELF]: messages }));
        });

        return this;
    }

    _addForEachValidatorToRuleSets (propName, accessor, validator) {
        this.ruleSets.push((data, vState) => {
            const iter = getIterable(propName, accessor, data);
            let validatorResultMap = Map();

            for (let i = 0; i < iterableLength(iter); i++) {
                const validatorResult = validator.validate(get(iter, i));
                validatorResultMap = validatorResultMap.set(i, validatorResult);
            }

            return setMerged(vState, propName, validatorResultMap);
        });

        return this;
    }

    _addForEachRuleSetToRuleSets (propName, accessor, rules) {
        this.ruleSets.push((data, vState) => {
            const iter = getIterable(propName, accessor, data);
            let resultMap = Map();

            for (let i = 0; i < iterableLength(iter); i++) {
                const ruleReducer = buildRuleReducer(get(iter, i));
                const itemResult = rules.reduce(ruleReducer, Set());
                resultMap = resultMap.set(i, Map({ [SELF]: itemResult }));
            }

            return setMerged(vState, propName, resultMap);
        });

        return this;
    }

    static isInstance (obj) {
        if (!obj) return false;
        return (isFunction(obj.validate));
    }

    static which (chooseValidator) {
        if (!isFunction(chooseValidator)) {
            throw new TypeError(`Call Validator.which with a function returning a validator or null`);
        }

        return new ValidatorWrapper(chooseValidator);
    }
}

export default Validator;