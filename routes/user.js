// Users
app.get('/users/new', function(req, res) {
  res.render('users/new.ejs', {
    locals: { user: new app.models.User() },
    layout: true, title: 'AI Challenge - Bomberbot - Ingreso'
  });
});

app.post('/users.:format?', function(req, res) {
  var user = new app.models.User(req.body.user);

  function userSaveFailed() {
    req.flash('error', 'Account creation failed');
    res.render('users/new.ejs', {
      locals: { user: user }
    });
  }

  user.save(function(err) {
    if (err) {
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
