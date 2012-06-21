var fs = require('fs');
module.exports = function(mongoose){
	var models = {};

	var models_path = __dirname + '/models'
	var model_files = fs.readdirSync(models_path)
	model_files.forEach(function(file){
		var model = require(models_path+'/'+file)(mongoose);
		models[model.modelName]=model;
	})

	return models;
}

