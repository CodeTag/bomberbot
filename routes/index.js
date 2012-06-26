
app.get('/', app.util.loadUser, function(req, res){
  res.render('index', {
                      layout: true, 
                      title: 'AI Challenge - Bomberbot',
                      locals: {username: req.currentUser.get('username')}
                      });
});
app.get('/howto', function(req, res){
  res.render('howto', {
                      layout: true, 
                      title: 'Howto AI Challenge - Bomberbot'
                      });
});