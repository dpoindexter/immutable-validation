import Imm from 'immutable';
import { isFunction, isIterable, hasProp } from './util';
import ValidatorWrapper from './ValidatorWrapper';

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
    if (!hasProp(result, 'isValid') || !hasProp(result, 'message')) {
        throw new Error('Rules must return a result with the properties `isValid` and `message`. Use ImmutableValidation.rule()');
    }
    return result;
}

function iterableAccessor (propName, accessor, data) {
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

    return vState.set(propName, Imm.Map(newData));
}

function buildRuleSet (propName, accessor, rules) {
    return (data, vState) => {
        const existing = vState.getIn([ propName, SELF ]) || Imm.Set();
        const ruleReducer = buildRuleReducer(accessor(data));
        const messages = rules.reduce(ruleReducer, existing);
        return vState.set(propName, Imm.Map({ [SELF]: messages }));
    }
}

function buildRuleSetForValidator (propName, accessor, validator) {
    return (data, vState) => {
        const val = accessor(data);
        const validatorResult = validator.validate(val);
        return setMerged(vState, propName, validatorResult);
    }
}

function buildRuleSetForEachValidator (propName, accessor, validator) {
    return (data, vState) => {
        const iter = iterableAccessor(propName, accessor, data);

        const resultMap = iter.reduce((results, item, i) => {
            const validatorResult = validator.validate(item);
            return results.set(i, validatorResult);
        }, Imm.Map());

        return setMerged(vState, propName, resultMap);
    }
}

function buildRuleSetForEachItem (propName, accessor, rules) {
    return (data, vState) => {
        const iter = iterableAccessor(propName, accessor, data);

        const resultMap = iter.reduce((results, item, i) => {
            const ruleReducer = buildRuleReducer(item);
            const itemResult = rules.reduce(ruleReducer, Imm.Set());
            return results.set(i, Imm.Map({ [SELF]: itemResult }));
        }, Imm.Map())

        return setMerged(vState, propName, resultMap);
    }
}

function extendRuleSets (baseValidator, ruleSet) {
    const extendedValidator = new Validator();
    extendedValidator.ruleSets = baseValidator.ruleSets.concat(ruleSet);
    return extendedValidator;
}

class Validator {
    constructor () {
        this.ruleSets = [];
        this.validationState = Imm.Map({
            isValid: true
        });
    }

    ruleFor (propName, accessor, ...rules) {
        const ruleSet = (Validator.isInstance(rules[0]))
            ? buildRuleSetForValidator(propName, accessor, rules[0])
            : buildRuleSet(propName, accessor, rules);

        return extendRuleSets(this, ruleSet);
    }

    ruleForEach (propName, accessor, ...rules) {
        const ruleSet = (Validator.isInstance(rules[0]))
            ? buildRuleSetForEachValidator(propName, accessor, rules[0])
            : buildRuleSetForEachItem(propName, accessor, rules);

        return extendRuleSets(this, ruleSet);
    }

    validate (dataToValidate) {
        const newVState = this.ruleSets.reduce((messages, ruleSet) =>
            ruleSet(dataToValidate, messages), Imm.Map());

        const isValid = newVState.entrySeq()
            .filter(([ key ]) => key !== 'isValid')
            .reduce(resultReducer, true);

        this.validationState = newVState.set('isValid', isValid);

        return this.validationState;
    }

    static isInstance (obj) {
        if (!obj) return false;
        return (isFunction(obj.validate));
    }

    static which (chooseValidator) {
        if (!isFunction(chooseValidator)) {
            throw new TypeError('Call Validator.which with a function returning a validator or null');
        }

        return new ValidatorWrapper(chooseValidator);
    }
}

export default Validator;