
app.get('/', function(req, res){
  res.render('index', {
                      layout: true, 
                      title: 'AI Challenge - Bomberbot'
                      });
});
app.get('/howto', function(req, res){
  res.render('howto', {
                      layout: true, 
                      title: 'Howto AI Challenge - Bomberbot'
                      });
});
