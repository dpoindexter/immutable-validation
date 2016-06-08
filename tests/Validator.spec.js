import { expect } from 'chai';
import Immutable from 'immutable';
import rule from '../src/rule';
import { required } from '../src/predicates';
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
        zipCode: '7870',
        country: 'US'
    }
});

const isValidZip = (val) => val.length === 5;

const fNameRequired = rule(required, 'First name is required');
const lNameRequired = rule(required, 'Last name is required');
const lNameStartsWithP = rule((val) => val[0] === 'P', 'Your last name must start with a P');
const zipCodeRequired = rule(required, 'Please enter a ZIP code');
const zipCodeIsValid = rule(isValidZip, 'Bad zip code');
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

            expect(validationState.rules).to.contain.keys('firstNameStuff', 'lastNameStuff');
        });

        it('returns lists of messages describing failed validation rules for each rule set', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), lNameStartsWithP);

            const validationState = personValidator.validate(personData).toJS();

            expect(validationState.rules.lastName.messages.length).to.equal(1);
            expect(validationState.rules.lastName.messages[0])
                .to.equal('Your last name must start with a P');
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

            expect(validationState.rules.firstName.messages.length).to.equal(2);
        });

        it('throws when running a rule that does not return a well-formed response', () => {
            const personValidator = new Validator()
                .ruleFor('lastName', (p) => p.get('lastName'), (val) => !!val);

            expect(() => personValidator.validate(personData))
                .to.throw(/Rules must return a result/);
        });

        describe('a nested validator', () => {

            it('returns a nested validationState', () => {
                const personValidator = new Validator()
                    .ruleFor('firstName', (p) => p.get('firstName'), fNameRequired)
                    .ruleFor('address', (p) => p.get('address'), new Validator()
                        .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeRequired)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.rules.address).to.contain.keys('isValid', 'rules');
                expect(validationState.rules.address.rules).to.contain.keys('zipCode');
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

            it('can run both Validators and rulesets for the same property name', () => {
                const mustHavePostalCodeIfUS = rule((addr) => (
                    (addr.get('country') === 'US')
                        ? isValidZip(addr.get('zipCode'))
                        : true
                ), 'You need a zip code if you\'re in the US');

                const personValidator = new Validator()
                    .ruleFor('address', (p) => p.get('address'), mustHavePostalCodeIfUS)
                    .ruleFor('address', (p) => p.get('address'), new Validator()
                        .ruleFor('zipCode', (a) => a.get('zipCode'), zipCodeRequired)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.rules.address.rules).to.contain.keys('zipCode');
                expect(validationState.rules.address.messages.length).to.equal(1);
            });

        });

        describe('using ruleForEach', () => {

            it('runs the given rule set for every value in an iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('foodAllergies', (p) => p.get('foodAllergies'), isRealAllergen);
                
                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.isValid).to.be.false;
                expect(validationState.rules.foodAllergies.rules[1].messages[0])
                    .to.equal('No one is allergic to Raisins');
            });

            it('applies nested validators to every value in an iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('contactMethods', (p) => p.get('contactMethods'), new Validator()
                        .ruleFor('type', (c) => c.get('type'), isUsableContactMethod)
                    );
                
                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.isValid).to.be.false;
                expect(validationState.rules.contactMethods.rules[1].rules.type.messages[0])
                    .to.equal('We can\'t use fax to contact you');
            });

            it('throws if the value returned by the accessor function isn\'t iterable', () => {
                const personValidator = new Validator()
                    .ruleForEach('lastName', (p) => p.get('lastName'), isRealAllergen);

                expect(() => personValidator.validate(personData))
                    .to.throw(/is a non-iterable value/);
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

                expect(validationState.rules.contactMethods.rules[0].rules.value.messages[0]).to.equal('Bad phone number');
                expect(validationState.rules.contactMethods.rules[2].rules.value.messages[0]).to.equal('Bad email address');
            });

            it('does not perform validation if no validator matches', () => {
                const personValidator = new Validator()
                    .ruleForEach(
                        'contactMethods',
                        (p) => p.get('contactMethods'), 
                        Validator.which(() => null)
                    );

                const validationState = personValidator.validate(personData).toJS();

                expect(validationState.rules.contactMethods.rules[0].isValid).to.be.true;
                expect(validationState.rules.contactMethods.rules[1].isValid).to.be.true;
                expect(validationState.rules.contactMethods.rules[2].isValid).to.be.true;
            });

            it('throws if not passed a function as its parameter', () => {
                expect(() => Validator.which()).to.throw(/a function returning a validator or null/);
            });

        });

        xdescribe('when validating asyncronous rules', () => {

        });

    });

    describe('when adding rules', () => {

        it('returns a new validator instance for added rules', () => {
            const personValidator = new Validator()
                .ruleFor('firstNameStuff', (p) => p.get('firstName'), fNameRequired);

            const personValidatorWithLastName = personValidator
                .ruleFor('lastNameStuff', (p) => p.get('lastName'), lNameRequired);

            const vState1 = personValidator.validate(personData).toJS();
            const vState2 = personValidatorWithLastName.validate(personData).toJS();

            expect(vState1.rules).to.not.contain.keys('lastNameStuff');
            expect(vState2.rules).to.contain.keys('lastNameStuff');
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