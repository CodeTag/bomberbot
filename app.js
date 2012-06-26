var express = require('express');
var connect = require('connect');
var db;

var app = module.exports = express.createServer();

app.mongoose = require('mongoose');
app.mongoStore = require('connect-mongodb');
app.connectTimeout = require('connect-timeout');
app.util = util = require('./util.js');

var config = require('./config.js')(app, express);

app.models = models = require('./models.js')(app.mongoose);
app.db = db = app.mongoose.connect(app.set('db-uri'));

app.routes = routes = require('./routes')(app, models);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


var serverTCP = require('./core');
