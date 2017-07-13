var SlackPromiser = require('SlackPromiser');

describe("A SlackPromiser", function() {
    it("should be able to retrieve the list of public channels", function(done) {
        var expectedChannels = "test";
        var token = "secrettoken";

        var slack = {
            channels: {
                list: function(parameters, callback) {
                    callback(null, expectedChannels);
                }
            }
        };
        spyOn(slack.channels, 'list').and.callThrough();

        var promiser = new SlackPromiser(slack, token);
        promiser.listChannels()
            .then(function(channels) {
                expect(channels).toEqual(expectedChannels);
                done();
            })
            .catch(function(err) {
                fail(err);
                done();
            });

        expect(slack.channels.list).toHaveBeenCalledWith({'token':token}, jasmine.any(Function));
    });
});
