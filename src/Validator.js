import Imm from 'immutable';
import curry from 'ramda/src/curry';
import pipe from 'ramda/src/pipe';
import both from 'ramda/src/both';
import tap from 'ramda/src/tap';
import { assert, isFunction, isIterable, maybeHas } from './util';
import ValidatorWrapper from './ValidatorWrapper';
import ValidationRecord from './ValidationRecord';

const MESSAGE = 'message';
const RULES = 'rules';
const IS_VALID = 'isValid';

function assertRuleResult (result) {
    const interfaceErr = new Error(
        `Rules must return a result with the
        properties \`isValid\` and \`message\`.
        Use ImmutableValidation.rule()`
    );
    assert(
        both(maybeHas(IS_VALID), maybeHas(MESSAGE))(result),
        interfaceErr
    );
}

function assertIterable (propName) {
    const iterableErr = new TypeError(
        `\`${propName}\` is a non-iterable value.
        ruleForEach applies a validation rule to
        each item in an iterable`
    );
    return obj => assert(isIterable(obj), iterableErr);
}

const reduceRules = curry((data, messagesForProp, rule) => {
    const { isValid, message } = tap(assertRuleResult, rule(data));
    return (!isValid)
        ? messagesForProp.add(message)
        : messagesForProp;
});

const createResult = ValidationRecord.create;

const evaluateRules = curry((rules, data) =>
    rules.reduce(reduceRules(data), Imm.Set())
);

const evaluateValidator = curry((validator, data) => 
    validator.validate(data)
);

const merge = curry((propName, vState, result) =>
    result.mergeDeep(vState.getIn([RULES, propName]))
);

const setResult = curry((propName, vState, result) =>
    vState.set(IS_VALID, vState.get('isValid') && result.get('isValid'))
          .setIn([RULES, propName], result)
);

function buildRuleSet (propName, getData, rules) {
    const evaluateData = evaluateRules(rules);
    const mergeWithExisting = merge(propName);
    const setForProp = setResult(propName);

    return (vState, data) => pipe(
        getData,
        evaluateData, 
        createResult,
        mergeWithExisting(vState),
        setForProp(vState)
    )(data);
}

function buildRuleSetForValidator (propName, getData, validator) {
    const evaluateData = evaluateValidator(validator);
    const mergeWithExisting = merge(propName);
    const setForProp = setResult(propName);

    return (vState, data) => pipe(
        getData,
        evaluateData,
        mergeWithExisting(vState),
        setForProp(vState)
    )(data);
}

function buildRuleSetForEachValidator (propName, getData, validator) {
    return (vState, data) => {
        const iter = tap(assertIterable(propName), getData(data));

        const result = iter.reduce((record, item, i) => {
            return setResult(i, record, validator.validate(item));
        }, createResult());

        return setResult(propName, vState, result);
    }
}

function buildRuleSetForEachItem (propName, getData, rules) {
    const evaluateData = evaluateRules(rules);

    return (vState, data) => {
        const iter = tap(assertIterable(propName), getData(data));
        const result = iter.reduce((record, item, i) => (
            pipe(
                evaluateData,
                createResult,
                setResult(i, record)
            )(item)
        ), createResult());

        return setResult(propName, vState, result);
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
        this.validationState = this.ruleSets.reduce((messages, ruleSet) =>
            ruleSet(messages, dataToValidate), ValidationRecord.create());

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