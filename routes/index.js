
app.get('/', function(req, res){
    res.render('index', {layout: true, title: 'AI Challenge - Bomberbot'});
});