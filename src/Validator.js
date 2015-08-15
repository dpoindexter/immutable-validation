import { Map, Set } from 'immutable';

class Validator {
    constructor () {
        this.ruleSets = [];

        this.validationState = new Map({
            isValid: true,
            messages: new Map()
        });
    }

    ruleFor (propName, accessor, ...rules) {
        return (rules.length === 1 && Validator.is(rules[0]))
            ? this._addValidatorToRuleSets(propName, accessor, rules[0])
            : this._addRuleSetToRuleSets(propName, accessor, rules);
    }

    _addValidatorToRuleSets (propName, accessor, validator) {
        this.validationState = this.validationState.setIn(['messages', propName], new Map());

        this.ruleSets.push((dataToValidate, validationMessages) => {
            const validatorResult = validator.validate(dataToValidate);
            return validationMessages.set(propName, validatorResult);
        });

        return this;
    }

    _addRuleSetToRuleSets (propName, accessor, rules) {
        this.validationState = this.validationState.setIn(['messages', propName], new Set());

        this.ruleSets.push((dataToValidate, validationMessages) => {
            return rules.reduce((allMessages, rule) => {
                const messages = allMessages.get(propName);

                const val = accessor(dataToValidate);
                const { isValid, message } = rule(val);

                return (isValid)
                    ? allMessages.set(propName, messages.delete(message))
                    : allMessages.set(propName, messages.add(message));

            }, validationMessages);
        });

        return this;
    }

    validate (dataToValidate) {
        const newMessages = this.ruleSets.reduce((messages, ruleSet) =>
            ruleSet(dataToValidate, messages), this.validationState.get('messages'));

        const isValid = newMessages.every((prop) => !prop.count());

        this.validationState = this.validationState.withMutations((vState) => {
            return vState
                .set('isValid', isValid)
                .set('messages', newMessages);
        });

        return this.validationState;
    }
}

export default Validator;