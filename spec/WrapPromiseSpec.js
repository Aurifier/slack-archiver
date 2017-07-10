var wrapPromise = require('WrapPromise');

function testEchoNoError(input, callback) {
    callback(null, input);
}

function testEchoConcat(input1, input2, callback) {
    callback(null, input1 + input2);
}

function testEchoWithError(err, callback) {
    callback(err, null);
}

class StatefulEchoer {
    constructor(input) {
        this.input = input;
    }

    testEchoConcat(input, callback) {
        callback(null, this.input + input);
    }
}

describe("A PromiseWrapper", function() {
    it("should return a Promise", function() {
        var promise = wrapPromise(function(){});
        expect(promise instanceof Promise).toBe(true);
    });

    describe(", when passed a function that takes node-style callbacks,", function() {
        it("should resolve if there is no error", function(done) {
            wrapPromise(testEchoNoError)
                .then(function() {
                    done();
                })
                .catch(function() {
                    fail("The promise was rejected");
                    done();
                });
        });

        it("should reject if there is an error", function(done) {
            wrapPromise(testEchoWithError)
                .then(function() {
                    fail("The promise resolved.");
                    done();
                })
                .catch(function() {
                    done();
                });
        });

        it("should accept a parameter to pass to the function", function(done) {
            var input = "Hello!";
            wrapPromise(testEchoNoError, input)
                .then(function(result) {
                    expect(result).toEqual(input);
                    done();
                });
        });

        //As it turns out, I don't think we require this
        xit("should accept multiple parameters to pass to the function", function(done) {
            var input1 = "Hello,";
            var input2 = " World!";
            wrapPromise(testEchoNoError, input1, input2)
                .then(function(result) {
                    expect(result).toEqual(input1 + input2);
                    done();
                })
                .catch(function() {
                    fail("The promise was rejected.");
                    done();
                });
        });

        //See https://stackoverflow.com/questions/5247060/in-javascript-is-there-equivalent-to-apply-that-doesnt-change-the-value-of-thi
        //As it turns out, this is determined by the caller
        xit("should preserve the state of the object the function is called against", function(done) {
            var input1 = "Hiya,";
            var input2 = " Earth!";
            var echoer = new StatefulEchoer(input1);

            wrapPromise(echoer.testEchoConcat.bind(echoer), input2)
                .then(function(result) {
                    expect(result).toEqual(input1 + input2);
                    done();
                })
                .catch(function(err) {
                    fail("The promise was rejected: " + err);
                    done();
                });
        });
    });
});
