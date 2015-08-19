export function identity (x) {
    return x;
}

export function noop () {
    return undefined;
}

export function toType (obj) {
    // IE requires some special-case handling, otherwise returns 'object' for both of the below
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    // Angus Croll (http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator)
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

export function isFunction (obj) {
    return toType(obj) === 'function';
}

export function isString (obj) {
    return toType(obj) === 'string';
}

export function partial (fn, ...argsToApply) {
    return function (...args) {
        return fn.apply(this, argsToApply.concat(args));
    };
}

/**
 * Ensures that the given argument can be called as a function:
 *
 *    var definitelyFn = asCallable(maybeFn);
 *    definitelyFn(); // calling maybeFn would throw if maybeFn is not a function
 *
 * @param {*} maybeFn - value to ensure is callable
 * @param {string|function} instead - function to call if maybeFn is not callable, OR the string 'identity' to return the value of maybeFn
 * @returns {function}
 */
export function asCallable (maybeFn, instead) {
    if (isFunction(maybeFn)) return maybeFn;
    if (isFunction(instead)) return partial(instead, maybeFn);
    if (instead === 'identity') return partial(identity, maybeFn);
    return noop;
}