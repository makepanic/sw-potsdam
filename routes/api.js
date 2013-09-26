/*global
 console,
 request
 */

/*
 * GET home page.
 */

var jsdom = require('jsdom'),
    request = require('request'),
    url = require('url'),
    fs = require('fs'),
    SWPTSDM = fs.readFileSync(__dirname + '/../build/sw-potsdam-0.0.1.js', 'utf-8'),
    jquery = fs.readFileSync(__dirname + '/../components/jquery/jquery.min.js', 'utf-8');

jsdom.defaultDocumentFeatures = {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
};

// TODO: external file
var cfg = {
    urls: {
        overview: 'http://www.studentenwerk-potsdam.de/speiseplan.html'
    }
};

exports.overview = function (req, res) {
    'use strict';

    request({
        uri: cfg.urls.overview
    }, function (err, response, body) {

        var that = this;

        if (err && response.statusCode !== 200) {
            console.log('Request error.');
        }

        jsdom.env({
            html: body,
            src: [
                SWPTSDM,
                jquery
            ],
            done: function (err, window) {
                var $ = window.jQuery,
                    SWPTSDM = window.SWPTSDM,
                    $nextDays;

                console.log($('.site_title_no_right h1').text());

                $nextDays = $('.bill_of_fare');
                return SWPTSDM.FoodOverview.parse($nextDays);
            }
        });

    });
};