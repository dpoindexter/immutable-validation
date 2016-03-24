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
        expect(record.get('isValid')).to.equal(true);
        expect(record.get('messages')).to.be.instanceOf(Imm.Set);
        expect(record.get('messages').size).to.equal(0);
        expect(record.get('rules')).to.be.instanceOf(Imm.Map);
        expect(record.get('rules').size).to.equal(0);
    });

    it('traverses nested records using a single rule name', () => {
        const fNameResult = result.refine('person');
        expect(fNameResult.get('isValid')).to.be.a('boolean');
        expect(fNameResult.get('rules').size).to.equal(1);
    });

    it('traverses nested records using an array of rule names', () => {
        const fNameResult = result.refine(['person', 'firstName']);
        expect(fNameResult.get('isValid')).to.equal(false);
        expect(fNameResult.get('messages').first()).to.equal(msg);
    });

    describe('instantiated using static `create` constructor', () => {

        it('is valid if no validation messages are given', () => {
            const record1 = ValidationRecord.create();
            expect(record1.get('isValid')).to.equal(true);

            const record2 = ValidationRecord.create(Imm.Set());
            expect(record2.get('isValid')).to.equal(true);
        });

        it('is invalid if messages are given', () => {
            const messages = Imm.Set(['foo']);
            const record = ValidationRecord.create(messages);
            expect(record.get('isValid')).to.equal(false);
            expect(record.get('messages')).to.equal(messages);
        });

    });

});