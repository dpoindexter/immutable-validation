import { expect } from 'chai';
import Immutable from 'immutable';
import rule from '../src/rule';
import { required } from '../src/facts';
import Validator from '../src/Validator';

const personData = Immutable.fromJS({
    firstName: 'John',
    lastName: 'Smith',
    address: {
        zipCode: '7870'
    }
});

const fNameRequired = rule(required, 'First name is required');
const lNameRequired = rule(required, 'Last name is required');
const lNameStartsWithP = rule((val) => val[0] === 'P', 'Your last name must start with a P');
const zipCodeRequired = rule(required, 'Please enter a ZIP code');
const zipCodeIsValid = rule((val) => val.length === 5);

describe('Validator', () => {
    describe('when validating', () => {
        it('returns a validationState object', () => {

            const personValidator = new Validator();

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState).to.contain.keys('isValid', 'messages');
        });

        it('passes validation when there are no failing rules', () => {
            const personValidator = new Validator()
                .ruleFor('firstNameStuff', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastNameStuff', (p) => p.get('lastName'), lNameRequired);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.true;
        });

        it('returns a keyed collection of messages for each rule set', () => {
            const personValidator = new Validator()
                .ruleFor('firstNameStuff', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastNameStuff', (p) => p.get('lastName'), lNameRequired);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.messages).to.contain.keys('firstNameStuff', 'lastNameStuff');
        });

        it('fails validation if any rule in a set fails', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), lNameRequired, lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.false;
        });

        it('contains a message describing failed validation rules', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.messages.lastName.length).to.equal(1);
            expect(validationState.messages.lastName[0]).to.equal('Your last name must start with a P');
        });

        it('fails validation if any rule set contains a failing rule', () => {
            const personValidator = new Validator()
                .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastName', (p) => p.get('lastName'), lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.false;
        });

        it('throws when running a rule that does not return a well-formed response', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), (val) => !!val);

            expect(() => personValidator.validate(personData)).to.throw(/Rules must return a result with the properties/);
        });

        it('returns a keyed validationState from nested validators', () => {
            const personValidator = new Validator()
                .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('address', (p) => p.get('address'), new Validator()
                    .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeRequired)
                );

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.messages.address).to.contain.keys('isValid', 'messages');
        });

        it('fails validation if a nested validator fails validation', () => {
            const personValidator = new Validator()
                .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('address', (p) => p.get('address'), new Validator()
                    .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeIsValid)
                );

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.false;
        });
    });

    describe('when duck-typing a Validator', () => {
        it('returns true if the checked object implements `validate` and `ruleFor` methods', () => {
            const validator = new Validator();

            expect(Validator.isInstance(validator)).to.be.true;
        });

        it('returns false if the checked object does not implement `validate` or `ruleFor`', () => {
            const noValidateMethod = {
                ruleFor () {
                    return undefined;
                }
            };

            const noRuleForMethod = {
                validate () {
                    return undefined;
                }
            };

            expect(Validator.isInstance(noValidateMethod)).to.be.false;
            expect(Validator.isInstance(noRuleForMethod)).to.be.false;
        });
    });
});