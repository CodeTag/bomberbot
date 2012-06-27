
app.get('/', function(req, res){

  models.Partida.find( {}, function (err, found) {
  	console.log(found.length); // '****-****-****-1234'
  	console.log(found[0].logPartida); // '****-****-****-1234'
  	res.render('index', {
                      layout: true, 
                      title: 'AI Challenge - Bomberbot', 
                      partidaCargada: found[0].logPartida
                      });
  });
  
});
app.get('/howto', function(req, res){
  res.render('howto', {layout: true, title: 'Howto AI Challenge - Bomberbot'});
});
app.get('/ranking', function(req, res){
  res.render('ranking', 
    {layout:true, title: 'Ranking AI Challenge - Bomberbot',
    users:[{},{},{}, position=0]
    });
});
