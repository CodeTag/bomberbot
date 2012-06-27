var fs = require('fs');
module.exports = function(mongoose){
	var models = {};

	var models_path = __dirname + '/models'

	var user = require(models_path+'/user.js')(mongoose);
	models[user.modelName]=user;
	var loginToken = require(models_path+'/loginToken.js')(mongoose);
	models[loginToken.modelName]=loginToken;
	var partida = require(models_path+'/partida.js')(mongoose);
	models[partida.modelName]=partida;
	
	return models;
}

