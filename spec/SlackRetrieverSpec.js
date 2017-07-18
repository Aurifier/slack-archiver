var SlackRetriever = require('SlackRetriever');

describe("A SlackRetriever", function() {
    it("should retrieve all messages from a named channel for a given timespan", function(done) {
        var channelId = "FUzZyWuxzyWuxaBer";
        var channelName = "information";
        var channels = {
            "channels": [
                {
                    "id": channelId,
                    "name": channelName
                }
            ]
        };

        var expectedHistory = "an object of some kind dun really matter";

        var slack = {
            listChannels: function() {
                return new Promise(function(resolve, reject) {
                    resolve(channels);
                });
            },
            getChannelHistory: function(channelId) {
                return new Promise(function(resolve, reject) {
                    resolve(expectedHistory);
                });
            }
        };
        spyOn(slack, 'getChannelHistory').and.callThrough();

        var retriever = new SlackRetriever(slack);
        var promise = retriever.getChannelHistory(channelName);

        promise
            .then(history => {
                expect(slack.getChannelHistory).toHaveBeenCalledWith(channelId);
                expect(history).toEqual(expectedHistory);
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    });
    //TODO: What if channel isn't in channels?
});
