/*global
 console,
 request
 */

var request = require('request'),
    url = require('url'),
    fs = require('fs'),
    SWPTSDM = require('../build/sw-potsdam-0.0.1.js'),
    cheerio = require('cheerio'),
    nconf = require('nconf'),

    // nconf vars
    urls,
    cache;

// load config file
nconf.argv().file({ file: './conf.json' });

urls = nconf.get('urls');
cache = nconf.get('cache');

exports.overview = function (req, res) {
    'use strict';

    var oldCreated = 0,
        responseData = {},
        fileLoaded = function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw 'Error parsing cached json file.';
            }

            oldCreated = data.hasOwnProperty('created') ? data.created : 0;

            console.log('oldCreated', oldCreated);
            console.log('nconf.ttl', nconf.get('ttl'));
            console.log('now', Date.now());
            console.log(data);

            // open file check created timestamp
            if (!(Date.now() - nconf.get('ttl') > oldCreated)) {
                // send old json file
                console.log('using existing json file', data);

                responseData = data;
                res.send(responseData);

            } else {
                console.log('generating new json file');

                request({
                    uri: urls.overview
                }, function (err, response, body) {
                    var $,
                        $nextDays,
                        data = {},
                        foodOverview;

                    if (err && response.statusCode !== 200) {
                        throw 'Request error.';
                    }

                    $ = cheerio.load(body);

                    SWPTSDM.boot($);
                    $nextDays = SWPTSDM.$('.bill_of_fare');

                    // TODO: utf8-decode, save to json file
                    foodOverview = SWPTSDM.FoodOverview.extract($nextDays);
                    data.created = Date.now();
                    data.data = foodOverview;

                    responseData = data;

                    fs.writeFile([cache.dir, cache.overview].join('/'), JSON.stringify(responseData), function (err) {
                        if (err) {
                            throw 'Error writing file';
                        }

                        res.send(responseData);
                    });

                });
            }
        };

    fs.readFile([cache.dir, cache.overview].join('/'), 'utf8', function (err, data) {
        if (err) {
            throw 'Error reading file ' + [cache.dir, cache.overview].join('/');
        }
        fileLoaded(data);
    });
};