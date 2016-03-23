import Imm from 'immutable';

const ValidationRecord = Imm.Record({
    isValid: true,
    rules: Imm.Map(),
    messages: Imm.Set()
});

ValidationRecord.create = (messages) => {
    return new ValidationRecord({
        isValid: (messages) ? messages.isEmpty() : true,
        messages
    });
}

export default ValidationRecord;