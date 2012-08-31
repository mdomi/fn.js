(function (fn, expect, sinon) {

    describe('fn.transforms', function () {

        it('should be attached to the root namespace', function () {

            expect(fn.transforms).to.be.an('object');

        });

        describe('property', function () {

            it('should return functions that pick off object properties', function () {

                var namePropertyTransform = fn.property('name');

                expect(namePropertyTransform({
                    name : 'foo'
                })).to.be('foo');

            });

        });

        describe('modelAttribute', function () {

            it('should return functions that retrieve Backbone model style attributes', function () {

                var nameAttributeTransform = fn.modelAttribute('name');

                var model = {
                    get : sinon.stub().returns('foo')
                };

                expect(nameAttributeTransform(model)).to.be('foo');

                sinon.assert.calledOnce(model.get);
                sinon.assert.calledWith(model.get, 'name');
            });
        });

        describe('not', function () {

            it('should return functions that return the boolean opposite of inputs', function () {

                var notTransform = fn.not();

                expect(notTransform(false)).to.be(true);
                expect(notTransform('')).to.be(true);
                expect(notTransform(0)).to.be(true);
                expect(notTransform(null)).to.be(true);
                expect(notTransform(undefined)).to.be(true);
                expect(notTransform(NaN)).to.be(true);

                expect(notTransform(true)).to.be(false);
                expect(notTransform(Infinity)).to.be(false);
                expect(notTransform('foo')).to.be(false);
                expect(notTransform(1)).to.be(false);
                expect(notTransform(-1)).to.be(false);
                expect(notTransform(0.46846)).to.be(false);
                expect(notTransform(-456.498468)).to.be(false);
                expect(notTransform(new Date())).to.be(false);
                expect(notTransform({})).to.be(false);
                expect(notTransform([])).to.be(false);
            });
        });

        describe('negate', function () {

            it('should return functions that negate inputs', function () {

                var negateTransform = fn.negate();

                expect(negateTransform(false)).to.be(0);
                expect(negateTransform('')).to.be(0);
                expect(negateTransform(0)).to.be(0);
                expect(negateTransform(null)).to.be(0);
                expect(isNaN(negateTransform(undefined))).to.be(true);
                expect(isNaN(negateTransform(NaN))).to.be(true);

                expect(negateTransform(true)).to.be(-1);
                expect(negateTransform(152)).to.be(-152);
                expect(negateTransform(1)).to.be(-1);
                expect(negateTransform(-1)).to.be(1);
                expect(negateTransform(0.252)).to.be(-0.252);
                expect(negateTransform(-16.23532)).to.be(16.23532);
                expect(negateTransform(Infinity)).to.be(-Infinity);
                expect(negateTransform(-Infinity)).to.be(Infinity);
            });
        });

        describe('toInteger', function () {

            it('should return functions that convert inputs to base 10 integers', function () {

                var toInteger = fn.toInteger();

                expect(toInteger(10)).to.be(10);
                expect(toInteger(110)).to.be(110);
                expect(toInteger(0)).to.be(0);
                expect(toInteger(-110)).to.be(-110);

                expect(toInteger('10')).to.be(10);
                expect(toInteger('110')).to.be(110);
                expect(toInteger('0')).to.be(0);
                expect(toInteger('-110')).to.be(-110);

                expect(toInteger('0000110')).to.be(110);
                expect(toInteger('-0000110')).to.be(-110);
                expect(toInteger('-0000110.343')).to.be(-110);
                expect(toInteger('-110.343')).to.be(-110);

                expect(isNaN(toInteger(''))).to.be(true);
                expect(isNaN(toInteger('     '))).to.be(true);
                expect(isNaN(toInteger('  dsgag geeasg   '))).to.be(true);
            });

        });

        describe('replace', function () {

            it('should return functions that replace occurences of a regex match', function () {

                var replaceFoo = fn.replace(/foo/g, 'bar');

                expect(replaceFoo('foobarfoo')).to.be('barbarbar');
                expect(replaceFoo('foo')).to.be('bar');
                expect(replaceFoo('something else')).to.be('something else');

            });

        });

        describe('prepend', function () {

            it('should return functions the prepend a string to their inputs', function () {

                var prependFoo = fn.prepend('foo');

                expect(prependFoo('foo')).to.be('foofoo');
                expect(prependFoo('bar')).to.be('foobar');

            });

        });

    });

}).call(this, require('../fn'), require('expect.js'), require('sinon'));