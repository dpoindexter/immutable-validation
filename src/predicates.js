import { isString, isNumber, isBoolean } from './util';

export function required (val) {
    if (!isString(val) && !isNumber(val) && !isBoolean(val)) return false;

    if (isString(val)) {
        return val.trim().length > 0;
    }

    if (isNaN(val)) return false;

    return true;
}

export function minLength (min) {
    return (val) => val.length >= min;
}

export function maxLength (max) {
    return (val) => val.length <= max;
}

// TODO: Curried functions
export function between (min, max) {
    return (val) => {
        const nVal = parseInt(val, 10);
        return (nVal >= min && nVal <= max);
    };
}

