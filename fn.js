// fn.js
// (c) 2012 Michael Dominice
// fn.js is freely distributable under the MIT license.
// Portions of fn are inspired by and intended for use with the Underscore
// library.
/*global define:false, module:false*/
(function (root, factory) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.fn = factory());
        });
    } else {
        // Browser globals
        root.fn = factory();
    }
}(this, function () {
    'use strict';
    var hasOwnProp = Object.prototype.hasOwnProperty;
    var fn = {};

    // transforms are functions that return functions that transform a
    // variable. useful for passing to things like map().
    fn.transforms = (function () {

        var transforms = {};

        /**
         * Transform that picks the value of the given property of
         * arguments.
         *
         * @return {Function} a function that returns the value of the
         *      given property on its first argument.
         */
        transforms.property = function (propertyName) {
            return function (object) {
                return object[propertyName];
            };
        };

        transforms.modelAttribute = function (attributeName) {
            return function (object) {
                return object.get(attributeName);
            };
        };

        function not(object) {
            return !object;
        }

        transforms.not = function () {
            return not;
        };

        function negate(object) {
            return -object;
        }

        transforms.negate = function () {
            return negate;
        };

        function toInteger(object) {
            return parseInt(object, 10);
        }

        transforms.toInteger = function () {
            return toInteger;
        };

        transforms.replace = function (regex, replacement) {
            return function (string) {
                return string.replace(regex, replacement);
            };
        };

        transforms.prepend = function(prefix) {
            return function (string) {
                return prefix + string;
            };
        };

        return transforms;

    }).call(this);

    // matchers are functions return functions that compare an object to a set of conditions.
    // useful for passing to bulk filtering functions.
    // should support partial application.
    fn.matchers = (function () {

        var matchers = {};

        matchers.eq = function (value, other) {
            if (arguments.length > 1) {
                return value === other;
            }
            return function (object) {
                return matchers.eq(object, value);
            };
        };

        matchers.gt = function (value, other) {
            if (arguments.length > 1) {
                return value > other;
            }
            return function (object) {
                return matchers.gt(object, value);
            };
        };

        matchers.lt = function (value, other) {
            if (arguments.length > 1) {
                return value < other;
            }
            return function (object) {
                return matchers.lt(object, value);
            };
        };

        matchers.neq = function (value, other) {
            if (arguments.length > 1) {
                return value !== other;
            }
            return function (object) {
                return matchers.neq(object, value);
            };
        };

        matchers.contains = function (array, other) {
            if (arguments.length > 1) {
                if (!(array && array.length)) {
                    return false;
                }
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === other) {
                        return true;
                    }
                }
                return false;
            }
            // array is actually a value to search for
            return function (actualArray) {
                return matchers.contains(actualArray, array);
            };
        };

        matchers['undefined'] = function (other) {
            if (arguments.length > 0) {
                return other === void 0;
            }
            return function (object) {
                return matchers['undefined'](object);
            };
        };

        matchers.defined = function (other) {
            if (arguments.length > 0) {
                return other !== void 0;
            }
            return function (object) {
                return matchers.defined(object);
            };
        };

        // do the mapping
        (function () {

            function attachMatcher(result, matcherName, matcher) {
                result[matcherName] = function () {
                    var createdMatcher = matcher.apply(this, arguments);
                    return function (object) {
                        return createdMatcher(result(object));
                    };
                };
            }

            function attachTransform(transformName, transform) {
                fn[transformName] = function () {
                    var result = transform.apply(this, arguments);
                    for (var matcherName in matchers) {
                        if (hasOwnProp.call(matchers, matcherName)) {
                            attachMatcher(result, matcherName, matchers[matcherName]);
                        }
                    }
                    return result;
                };
            }

            for (var transformName in fn.transforms) {
                if (hasOwnProp.call(fn.transforms, transformName)) {
                    attachTransform(transformName, fn.transforms[transformName]);
                }
            }

        }).call(this);

        return matchers;

    }).call(this);

    // extend fn with matchers
    for (var key in fn.matchers) {
        if (hasOwnProp.call(fn.matchers, key)) {
            fn[key] = fn.matchers[key];
        }
    }

    return fn;
}));