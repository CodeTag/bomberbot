
app.get('/', function(req, res){
  console.log(app)
  res.render('index', {
                      layout: true, 
                      title: 'AI Challenge - Bomberbot'
                      });
});
