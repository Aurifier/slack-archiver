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
    });
});
