/*eslint-env mocha */
import { expect } from 'chai';
import Immutable from 'immutable';
import rule from '../src/rule';
import { required } from '../src/facts';
import Validator from '../src/Validator';

const personData = Immutable.fromJS({
    firstName: 'John',
    lastName: 'Smith',
    foodAllergies: [ 'Tree Nuts', 'Raisins' ],
    contactMethods: [
        { type: 'phone', value: 210444779 },
        { type: 'fax', value: 2104447796 },
        { type: 'email', value: 'johnsmith_gmail.com' }
    ],
    address: {
        zipCode: '7870'
    }
});

const fNameRequired = rule(required, 'First name is required');
const lNameRequired = rule(required, 'Last name is required');
const lNameStartsWithP = rule((val) => val[0] === 'P', 'Your last name must start with a P');
const zipCodeRequired = rule(required, 'Please enter a ZIP code');
const zipCodeIsValid = rule((val) => val.length === 5, 'Bad zip code');
const phoneNumberIsValid = rule((val) => ('' + val).length === 10, 'Bad phone number');
const emailIsValid = rule((val) => val.indexOf('@') > 0, 'Bad email address');

const isRealAllergen = rule(
    (val) => ['Tree Nuts', 'Gluten'].indexOf(val) > -1,
    (val) => `No one is allergic to ${val}`
);

const isUsableContactMethod = rule(
    (val) => ['phone', 'email'].indexOf(val) > -1,
    (val) => `We can't use ${val} to contact you`
);

describe('Validator', () => {
    describe('when validating', () => {
        it('returns a validationState object', () => {
            const personValidator = new Validator();

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState).to.contain.keys('isValid');
        });

        it('passes validation when there are no failing rules', () => {
            const personValidator = new Validator()
                .ruleFor('firstNameStuff', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastNameStuff', (p) => p.get('lastName'), lNameRequired);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.true;
        });

        it('returns a property for each rule set that contains results for that rule set', () => {
            const personValidator = new Validator()
                .ruleFor('firstNameStuff', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastNameStuff', (p) => p.get('lastName'), lNameRequired);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState).to.contain.keys('firstNameStuff', 'lastNameStuff');
        });

        it('returns lists of messages describing failed validation rules for each rule set', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.lastName.self.length).to.equal(1);
            expect(validationState.lastName.self[0]).to.equal('Your last name must start with a P');
        });

        it('fails validation if any rule in a single set fails', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), lNameRequired, lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.false;
        });

        it('fails validation if any rule set contains failing rules', () => {
            const personValidator = new Validator()
                .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                .ruleFor('lastName', (p) => p.get('lastName'), lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.isValid).to.be.false;
        });

        it('can run multiple rule sets for the same property name', () => {
            const failingRule1 = rule(() => false, 'Failing rule 1');
            const failingRule2 = rule(() => false, 'Failing rule 2');

            const personValidator = new Validator()
                .ruleFor('firstName', (p) => p.get('firstName'), failingRule1)
                .ruleFor('firstName', (p) => p.get('firstName'), failingRule2);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.firstName.self.length).to.equal(2);
        });

        it('throws when running a rule that does not return a well-formed response', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), (val) => !!val);

            expect(() => personValidator.validate(personData)).to.throw(/Rules must return a result with the properties/);
        });

        describe('a nested validator', () => {

            it('returns a nested validationState', () => {
                const personValidator = new Validator()
                    .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                    .ruleFor('address', (p) => p.get('address'), new Validator()
                        .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeRequired)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.address).to.contain.keys('isValid', 'zipCode');
            });

            it('fails validation if the nested validator fails', () => {
                const personValidator = new Validator()
                    .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                    .ruleFor('address', (p) => p.get('address'), new Validator()
                        .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeIsValid)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.isValid).to.be.false;
            });

        });

        describe('using ruleForEach', () => {

            it('runs the given rule set for every value in an iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('foodAllergies', (p) => p.get('foodAllergies'), isRealAllergen);
                
                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.isValid).to.be.false;
                expect(validationState.foodAllergies[1].self[0]).to.equal('No one is allergic to Raisins');
            });

            it('applies nested validators to every value in an iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('contactMethods', (p) => p.get('contactMethods'), new Validator()
                        .ruleFor('type', (c) => c.get('type'), isUsableContactMethod)
                    );
                
                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.isValid).to.be.false;
                expect(validationState.contactMethods[1].type.self[0]).to.equal('We can\'t use fax to contact you');
            });

            it('throws if the value returned by the accessor function isn\'t iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('lastName', (p) => p.get('lastName'), isRealAllergen);

                expect(() => personValidator.validate(personData)).to.throw(/is a non-iterable value/);
            });

        });

        describe('using Validator.which', () => {

            it('chooses a validator to use at runtime', () => {
                const contactMethodValidators = {
                    email: new Validator()
                        .ruleFor('value', (c) => c.get('value'), emailIsValid),

                    phone: new Validator()
                        .ruleFor('value', (c) => c.get('value'), phoneNumberIsValid)
                };

                const personValidator = new Validator()
                    .ruleForEach(
                        'contactMethods',
                        (p) => p.get('contactMethods'), 
                        Validator.which((cm) => contactMethodValidators[cm.get('type')])
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.contactMethods[0].value.self[0]).to.equal('Bad phone number');
                expect(validationState.contactMethods[2].value.self[0]).to.equal('Bad email address');
            });

            it('does not perform validation if no validator matches', () => {
                const personValidator = new Validator()
                    .ruleForEach(
                        'contactMethods',
                        (p) => p.get('contactMethods'), 
                        Validator.which(() => null)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.contactMethods[0].isValid).to.be.true;
                expect(validationState.contactMethods[1].isValid).to.be.true;
                expect(validationState.contactMethods[2].isValid).to.be.true;
            });

            it('throws if not passed a function as its parameter', () => {
                expect(() => Validator.which()).to.throw(/a function returning a validator or null/);
            });

        });

    });

    describe('when duck-typing a Validator', () => {
        it('returns true if the checked object implements `validate` and `ruleFor` methods', () => {
            const validator = new Validator();

            expect(Validator.isInstance(validator)).to.be.true;
        });

        it('returns false if the checked object does not implement `validate`', () => {
            const noValidateMethod = {
                ruleFor () {
                    return undefined;
                }
            };

            expect(Validator.isInstance(noValidateMethod)).to.be.false;
        });
    });
});