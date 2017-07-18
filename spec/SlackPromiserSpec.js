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
    //TODO: Verify what happens if we come back with errors

    it("should be able to retrieve the history of a given channel", function(done) {
        var expectedHistory = "floopemdoopem";
        var token = "itsatokenIthnik";
        var expectedId = "yerchannelHere";

        var slack = {
            channels: {
                history: function(parameters, callback) {
                    callback(null, expectedHistory);
                }
            }
        };
        spyOn(slack.channels, 'history').and.callThrough();

        var promiser = new SlackPromiser(slack, token);
        promiser.getChannelHistory(expectedId)
            .then(function(history) {
                expect(slack.channels.history).toHaveBeenCalledWith({'token':token, 'channel': expectedId}, jasmine.any(Function));
                expect(history).toEqual(expectedHistory);
                done();
            })
            .catch(function(err) {
                fail(err);
                done();
            });
    });
});
