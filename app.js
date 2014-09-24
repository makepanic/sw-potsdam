/*jslint nomen:true*/

/*global
 console
 */

/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    api = require('./routes/api');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components',  express.static(path.join(__dirname, 'components')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', routes.index);
app.get('/users', user.list);

// api routes
app.get('/api', api.overview);

http.createServer(app).listen(app.get('port'), function () {
    'use strict';

    console.log('Express server listening on port ' + app.get('port'));
});
