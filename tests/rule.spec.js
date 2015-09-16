/*eslint-env mocha */
import { expect } from 'chai';
import rule from '../src/rule';

describe('rule', () => {
    it('constructs a function from a predicate and message', () => {
        const requiredRule = rule((val) => !!val, 'Value is required');
        expect(requiredRule).to.be.a('function');
    });

    it('returns a function returning { isValid, message }', () => {
        const requiredRule = rule((val) => !!val, 'Value is required');
        expect(requiredRule(undefined)).to.eql({ isValid: false, message: 'Value is required' });
    });

    it('always returns as valid if the passed-in predicate is not a function', () => {
        const noPredicate = rule(false, 'Should be valid');
        const { isValid } = noPredicate(undefined);

        expect(isValid).to.be.true;
    });

    it('can take a function as the message argument', () => {
        const alwaysInvalid = rule(() => false, () => 'Value is required');
        const { message } = alwaysInvalid(undefined);

        expect(message).to.equal('Value is required');
    });

    it('passes the value to validate to the message-returning function', () => {
        const isValidZipCode = rule((val) => val.length === 5, (val) => `'${val}' is an invalid zip code`);
        const { message } = isValidZipCode('7870');

        expect(message).to.equal(`'7870' is an invalid zip code`);
    });

    const nonStringMessageTests = [
        { messageType: 'complex type', arg: {} },
        { messageType: 'undefined', arg: undefined },
        { messageType: 'boolean', arg: true },
        { messageType: 'functions returning non-string', arg: () => undefined }
    ];

    nonStringMessageTests.forEach((t) => {
        it(`converts ${t.messageType} messages to the empty string`, () => {
            const alwaysInvalid = rule(() => false, t.message);
            const { message } = alwaysInvalid(undefined);

            expect(message).to.equal('');
        });
    });
});