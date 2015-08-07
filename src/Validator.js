import { Map, Set } from 'immutable';

class Validator {
    constructor () {
        this.ruleSets = [];

        this.validationState = new Immutable.Map({
            isValid: true,
            messages: new Immutable.Map()
        });
    }

    ruleFor (propName, accessor, ...rules) {
        this.validationState = this.validationState.setIn(['messages', propName], new Immutable.Set());

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