import Imm from 'immutable';
import Validator from './Validator';

class ValidatorWrapper {
    constructor (chooseValidator) {
        this.getValidator = chooseValidator;
    }

    validate (dataToValidate) {
        const v = this.getValidator(dataToValidate);

        if (!Validator.isInstance(v)) {
            return Imm.Map({ isValid: true });
        }

        return v.validate(dataToValidate);
    }
}

export default ValidatorWrapper;