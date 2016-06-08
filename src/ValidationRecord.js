import Imm from 'immutable';
import intersperse from 'ramda/src/intersperse';
import prepend from 'ramda/src/prepend';
import { liftToArray } from './util';

const RULES = 'rules';

class ValidationRecord extends Imm.Record({
    isValid: true,
    rules: Imm.Map(),
    messages: Imm.Set()
}) {
    refine (path) {
        path = liftToArray(path);
        const actualPath = prepend(RULES, intersperse(RULES, path));
        return this.getIn(actualPath);
    }
}

ValidationRecord.create = (messages) => {
    return new ValidationRecord({
        isValid: (messages) ? messages.isEmpty() : true,
        messages
    });
}

export default ValidationRecord;