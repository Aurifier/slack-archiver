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

    it("should reject appropriately if the channel doesn't exist", function(done) {
        var channelName = "floop";
        var channels = {
            "channels": [
                {
                    "id": "general",
                    "name": "general"
                },
                {
                    "id": "news",
                    "name": "news"
                }
            ]
        };

        var slack = {
            listChannels: function() {
                return new Promise(function(resolve, reject) {
                    resolve(channels);
                });
            }
        };

        var retriever = new SlackRetriever(slack);
        var promise = retriever.getChannelHistory(channelName);

        promise.
            then(history => {
                fail("Promise should have been rejected");
                done();
            })
            .catch(err => {
                expect(err).toEqual("The channel \"" + channelName + "\" was not found.");
                done();
            });
    });
});
