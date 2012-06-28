
app.get('/', function(req, res){

  models.Partida.find({}).sort('fecha',-1).execFind(
    function (err, found) {
      console.log("entro");
      if(err){
          console.log("error "+err);
      }
        

      models.User.find({$or:[{_id:found[0].jugadorA},
                         {_id:found[0].jugadorB},
                         {_id:found[0].jugadorC},
                         {_id:found[0].jugadorD}]},
                         function(err, dbuser){
                                
                        res.render('index', {
                                      layout: true, 
                                      title: 'AI Challenge - Bomberbot', 
                                      partidaCargada: found[0].logPartida,
                                      jugadorA:found[0].jugadorA,
                                      jugadorB:found[0].jugadorB,
                                      jugadorC:found[0].jugadorC,
                                      jugadorD:found[0].jugadorD
                        });
            });

                                
        });
  
});
app.get('/howto', function(req, res){
  res.render('howto', {layout: true, title: 'Howto AI Challenge - Bomberbot'});
});
app.get('/ranking', function(req, res){
  models.User.find(function(err, users){
    console.log(users);
    res.render('ranking', 
      {layout:true, title: 'Ranking AI Challenge - Bomberbot',
      users:users
      });
  });
});
