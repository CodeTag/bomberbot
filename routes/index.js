
app.get('/', function(req, res){
	var user = req.body.user;
	res.render('index');
});