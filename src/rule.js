import { asCallable, isString } from './util';

export default function rule (predicate, message) {
    predicate = asCallable(predicate, () => true);
    message = asCallable(message, (msg) => {
        return (isString(msg)) ? msg : '';
    });

    return (val) => {
        const isValid = predicate(val);
        const msg = message(val);
        return { isValid, message: msg };
    };
}