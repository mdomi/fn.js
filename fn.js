// fn.js
// (c) 2012 Michael Dominice
// fn.js is freely distributable under the MIT license.
// Portions of fn are inspired by and intended for use with the Underscore library.
(function (define) {
    define('fn', function (require, exports) {
        
        var hasOwnProp = Object.prototype.hasOwnProperty;
        var fn = {};
        
        // transforms are functions that return functions that transform a variable.
        // useful for passing to things like map().
        fn.transforms = (function () {
            
            var transforms = {};
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
            
            transforms.not = function () {
                return function (object) {
                    return !object;
                };
            };
            
            transforms.negate = function () {
                return function (object) {
                    return -object;
                };
            };
            
            transforms.toInteger = function () {
                return function (object) {
                    return parseInt(object, 10);
                };
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
        // userful for passing to bulk filtering functions.
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
        
        //Attach properties to exports.
        exports.fn = fn;
        
        return fn;
    });
    
}).call(this, (typeof define === 'function' && define.amd) ? define : function (id, factory) {
    
    if (typeof exports !== 'undefined') {
        factory(require, exports);
    } else {
        factory(function (value) {
            return window[value];
        }, (window[id] = {}));
    }
});
