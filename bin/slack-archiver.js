#!/usr/bin/env node
var config = require('../config');
var slack = require('slack');

slack.channels.list({'token':config.apiToken}, console.log);
