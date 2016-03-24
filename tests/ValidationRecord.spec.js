import { expect } from 'chai';
import Imm from 'immutable';
import ValidationRecord from '../src/ValidationRecord';

const msg = 'First name is required';
const result = new ValidationRecord({ 
    rules: Imm.Map({ 
        person: new ValidationRecord({
            rules: Imm.Map({
                firstName: ValidationRecord.create(Imm.Set([msg]))
            })
        })
    })
});

describe('ValidationRecord', () => {

    it('instantiates with default values', () => {
        const record = new ValidationRecord();
        expect(record.isValid).to.equal(true);
        expect(record.messages).to.be.instanceOf(Imm.Set);
        expect(record.messages.size).to.equal(0);
        expect(record.rules).to.be.instanceOf(Imm.Map);
        expect(record.rules.size).to.equal(0);
    });

    it('traverses nested records using a single rule name', () => {
        const fNameResult = result.refine('person');
        expect(fNameResult.isValid).to.be.a('boolean');
        expect(fNameResult.rules.size).to.equal(1);
    });

    it('traverses nested records using an array of rule names', () => {
        const fNameResult = result.refine(['person', 'firstName']);
        expect(fNameResult.isValid).to.equal(false);
        expect(fNameResult.messages.first()).to.equal(msg);
    });

    describe('instantiated using static `create` constructor', () => {

        it('is valid if no validation messages are given', () => {
            const record1 = ValidationRecord.create();
            expect(record1.isValid).to.equal(true);

            const record2 = ValidationRecord.create(Imm.Set());
            expect(record2.isValid).to.equal(true);
        });

        it('is invalid if messages are given', () => {
            const messages = Imm.Set(['foo']);
            const record = ValidationRecord.create(messages);
            expect(record.isValid).to.equal(false);
            expect(record.messages).to.equal(messages);
        });

    });

});