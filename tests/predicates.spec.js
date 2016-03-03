/*eslint-env mocha */
import { expect } from 'chai';
import { toType } from './../src/util';
import { required } from '../src/predicates';

describe('Required predicate', () => {

    const nonValues = [{}, [], null, undefined];

    nonValues.forEach((v) => {
        it(`returns false if the value's type is '${toType(v)}'`, () => {
            const actual = required(v);
            expect(actual).to.equal(false);
        });
    });

    it('returns false if the value is whitespace', () => {
        const actual = required(' ');
        expect(actual).to.equal(false);
    });

    it('returns false if the value is NaN', () => {
        const actual = required(NaN);
        expect(actual).to.equal(false);
    });

    it('returns true if the value is a non-empty, non-whitespace string', () => {
        const actual = required('foo');
        expect(actual).to.equal(true);
    });

    const numericValues = {
        ['integer']: 1,
        ['float']: 123.45,
        ['negative number']: -10,
        ['zero']: 0
    };

    Object.keys(numericValues).forEach((k) => {
        it(`returns true if the value is any ${k}`, () => {
            const actual = required(numericValues[k]);
            expect(actual).to.equal(true);
        });
    });

    it('returns true if the value is a boolean', () => {
        const actualTrue = required(true);
        const actualFalse = required(false);

        expect(actualTrue).to.equal(true);
        expect(actualFalse).to.equal(true);
    });

});