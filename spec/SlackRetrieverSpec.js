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

    it("should accept a Date to limit the range of messages retrieved", function(done) {
        var channelId = "whateverchannel";
        var dateToRetrieve = new Date(2017, 6, 20);
        var expectedOldest = "1500508799.999999";
        var expectedLatest = "1500595200.000000";

        var slack = {
            listChannels: function() {
                var channels = {
                    "channels": [
                        {
                            "id": channelId,
                            "name": channelId
                        }
                    ]
                };
                return Promise.resolve(channels);
            },
            getChannelHistory: function(id, oldest, latest) {
                return Promise.resolve({"Wrong!": ["It's", "a", "list."]});
            }
        }
        spyOn(slack, 'getChannelHistory').and.callThrough();

        var retriever = new SlackRetriever(slack);
        var promise = retriever.getChannelHistory(channelId, dateToRetrieve);

        promise.
            then(history => {
                expect(slack.getChannelHistory)
                    .toHaveBeenCalledWith(jasmine.any(String), expectedOldest, expectedLatest);
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    });
});
