import toType from 'ramda/src/type';
import partial from 'ramda/src/partial';
import has from 'ramda/src/has';
import hasIn from 'ramda/src/hasIn';
import both from 'ramda/src/both';
import is from 'ramda/src/is';
import either from 'ramda/src/either';
import isArrayLike from 'ramda/src/isArrayLike';

export function noop () {
    return undefined;
}

export function isFunction (obj) {
    return toType(obj) === 'Function';
}

export function isString (obj) {
    return toType(obj) === 'String';
}

export function isObject (obj) {
    return toType(obj) === 'Object';
}

export function isNumber (obj) {
    return toType(obj) === 'Number';
}

export function isBoolean (obj) {
    return toType(obj) === 'Boolean';
}

export function maybeHas (prop) {
    return both(is(Object), has(prop));
}

export const isIterable = both(
    is(Object),
    either(hasIn('length'), hasIn('size'))
);

export function iterableLength (iter) {
    if (!isIterable(iter)) return 0;
    if (iter.size) return iter.size;
    return iter.length;
}

export function unwrapImmutable (maybeImmutable) {
    if (!maybeImmutable) return maybeImmutable;
    if (isFunction(maybeImmutable.toJS)) return maybeImmutable.toJS();
    return maybeImmutable;
}

export function get (maybeImmutable, propOrIndex) {
    if (!maybeImmutable || typeof maybeImmutable !== 'object') return maybeImmutable;
    if (isFunction(maybeImmutable.get)) return maybeImmutable.get(propOrIndex);
    return maybeImmutable[propOrIndex];
}

export function assert (expr, err) {
    if (!expr) throw err;
}

export function assertFor (predicate, err, val) {
    assert(predicate(val), err);
    return val;
}

export function liftToArray (val) {
    return isArrayLike(val) ? val : [val];
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
    if (isFunction(instead)) return partial(instead, [maybeFn]);
    return noop;
}