export function required (val) {
    return !!val;
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

