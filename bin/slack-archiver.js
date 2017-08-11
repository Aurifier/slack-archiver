#!/usr/bin/env node
var config = require('../config');

var retriever = setupRetriever();
retriever.getChannelHistory(config.channel)
    .then(history => {
        console.log(history.messages.length);
    })
    .catch(err => {
        console.log(err);
    });

function setupRetriever() {
    var slack = require('slack');
    var SlackPromiser = require('SlackPromiser');
    var SlackRetriever = require('SlackRetriever');

    return new SlackRetriever(new SlackPromiser(slack, config.apiToken));
}
