/*global
 console,
 request
 */

var request = require('request'),
    url = require('url'),
    fs = require('fs'),
    SWPTSDM = require('../build/sw-potsdam-0.0.1.js'),
    cheerio = require('cheerio'),
    nconf = require('nconf')
    urls = nconf.get('urls');

// load config file
nconf.argv().file({ file: './config.json' });

exports.overview = function (req, res) {
    'use strict';

    var oldCreated = 0,
        oldData = {},
        responseData = {};

    // open file check created timestamp
    if (!(Date.now() - nconf.get('ttl') > oldCreated)) {
        // send old json file
        responseData = oldData;
    } else {
        request({
            uri: urls.overview
        }, function (err, response, body) {
            var $,
                $nextDays,
                data;

            if (err && response.statusCode !== 200) {
                console.log('Request error.');
            }

            $ = cheerio.load(body);

            SWPTSDM.boot($);
            $nextDays = SWPTSDM.$('.bill_of_fare');
            console.log(SWPTSDM.$('.site_title_no_right h1').text());

            // TODO: utf8-decode, save to json file
            data = SWPTSDM.FoodOverview.extract($nextDays);
            data.created = Date.now();

            responseData = data;
        });
    }

    res.send(responseData);
};