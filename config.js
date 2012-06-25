module.exports = function(app, express, mongoose){

  var config = this;

  //env specific config
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    app.set('db-uri', 'mongodb://localhost/bomberbot');
    app.set('view options', {
      pretty: true
    });
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    app.set('db-uri', '');
  });

  //generic config
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(app.connectTimeout({ time: 10000 }));
    app.use(express.session({ store: app.mongoStore(app.set('db-uri')), secret: 'topsecret' }));
    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });


  return config;

};
