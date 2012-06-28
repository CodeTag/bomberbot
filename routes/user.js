// Users
app.get('/users/new', function(req, res) {
  res.render('users/new.ejs', {
    locals: { user: new app.models.User() },
    layout: true, title: 'AI Challenge - Bomberbot - Ingreso'
  });
});

app.get('/users/profile', app.util.loadUser, function(req, res) {
  res.render('users/profile.ejs', {
    currentUser: req.currentUser,
    layout: true, title: 'AI Challenge - Bomberbot - Perfil'
  });
});

app.get('/users/games', app.util.loadUser, function(req, res){
  console.log(req.currentUser);
  console.log(req.currentUser.get("_id"));
  models.Partida.find({$or:[{jugadorA:req.currentUser.get("username")},
                         {jugadorB:req.currentUser.get("username")},
                         {jugadorC:req.currentUser.get("username")},
                         {jugadorD:req.currentUser.get("username")}]}).sort('fecha',-1).limit(10).execFind( function(err, listado){
                          if(err){
                            console.log("err "+err);
                          }
                          console.log("listado "+listado.length);
                          res.render("users/games.ejs",{
                            currentUser: req.currentUser,
                            partidas: listado,
                            layout:true, title:"AI Challenge - Bomberbot - Listado de partidas"
                          });
                          //res.send(listado);
                     });
});

app.post('/users.:format?', function(req, res) {
  var user = new app.models.User(req.body.user);

  function userSaveFailed() {
    console.log('Account creation failed');
    req.flash('error', 'Account creation failed');
    res.render('users/new.ejs', {
      locals: { user: user, username: req.currentUser.get('username') },
      layout: true, title: 'AI Challenge - Bomberbot - Ingreso'
    });
  }

  user.save(function(err) {
    if (err) {
      console.log(err)
      return userSaveFailed();
    } 

    req.flash('info', 'Your account has been created');

    switch (req.params.format) {
      case 'json':
        res.send(user.toObject());
      break;

      default:
        req.session.user_id = user.id;
        res.redirect('/');
    }
  });
});
