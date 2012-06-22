// Main file

var express = require('express');
var app = module.exports = express.createServer();
app.mongoose = require('mongoose');

var config = require('./config.js')(app, express);

models = require('./models.js')(app.mongoose);

require('./routes')(app, models);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


