import { asCallable, isString } from './util';

export default function rule (fact, message) {
    fact = asCallable(fact, () => true);
    message = asCallable(message, (msg) => {
        return (isString(msg)) ? msg : '';
    });

    return (val) => {
        const isValid = fact(val);
        const msg = message(val);
        return { isValid, message: msg };
    };
}