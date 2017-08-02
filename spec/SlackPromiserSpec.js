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

    it("should accept an oldest and latest timestamp, using them exclusively", function(done) {
        var expectedOldest = "92803.0";
        var expectedLatest = "9023421.934";
        var slack = {
            channels: {
                history: function(parameters, callback) {
                    callback(null, {"The history": "of everything"});
                }
            }
        };
        spyOn(slack.channels, "history").and.callThrough();

        var promiser = new SlackPromiser(slack, 'atokenorsomething');
        promiser.getChannelHistory('someid', expectedOldest, expectedLatest)
            .then(history => {
                expect(slack.channels.history).toHaveBeenCalledWith({
                    'token': jasmine.any(String),
                    'channel': jasmine.any(String),
                    'oldest': expectedOldest,
                    'latest': expectedLatest,
                }, jasmine.any(Function));
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    });

    xit("should handle paging of results", function(done) {
        var firstPageEarliest = "98274.0";
        var message1 = {
            "ts": "blorp",
            "foo": "fookazoo"
        };
        var message2 = {
            "ts": firstPageEarliest,
            "foo": "bar"
        };
        var history1 = {
            "messages": [message1, message2],
            "has_more": true
        };

        var message3 = {"bat": "baz"};
        var history2 = {
            "messages": [message3],
            "has_more": false
        };
        var historyProvider = jasmine.createSpy().and.returnValues(history1, history2);
        var slack = {
            channels: {
                history: function(parameters, callback) {
                    callback(null, historyProvider());
                }
            }
        };
        spyOn(slack.channels, "history").and.callThrough();

        var promiser = new SlackPromiser(slack, "token");
        promiser.getChannelHistory('channelId')
            .then(history => {
                //Assert that we called slack.channels.history twice, with the correct parameters
                expect(slack.channels.history).toHaveBeenCalledWith({
                    'token': jasmine.any(String),
                    'channel': jasmine.any(String),
                    'latest': firstPageEarliest
                });
                expect(slack.channels.history).toHaveBeenCalledTimes(2);

                //Assert that we have messages from both requests
                expect(history.messages).toContain(message1);
                expect(history.messages).toContain(message2);
                expect(history.messages).toContain(message3);
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    });
});
