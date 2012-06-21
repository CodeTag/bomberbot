app.post('/example', function(req, res){
	var example = new models.examples();
	example.name=req.body.name;
	example.save(function (err) {
  		if(!err) {
  			res.send('ok');	
  		}
	});
});

app.get('/example', function(req, res){
  	models.examples.find({}, function (err, docs) {
  		console.log(docs);
  		res.send(docs);
  	});
});