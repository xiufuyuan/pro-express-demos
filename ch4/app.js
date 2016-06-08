// Import and instantiate dependencies
var express = require('express'),
  path = require('path'),
  fs = require('fs'),
  compression = require('compression'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  csrf = require('csurf'),
  timeout = require('connect-timeout'),
  methodOverride = require('method-override'),
  responseTime = require('response-time'),
  favicon = require('serve-favicon'),
  serveIndex = require('serve-index'),
  vhost = require('vhost'),  // enables you to use a different routing logic based on the domain.
  busboy = require('connect-busboy'),
  errorhandler = require('errorhandler');

var app = express();

// Configure settings
app.set('view cache', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

// Apply Middlewares

// gzip compression
app.use(compression({threshold: 1}));

// logger
// combined/common/short/tiny/dev
app.use(logger('combined'));

// parser params
app.use(bodyParser.json());
// processes URL-encoded data; e.g., name=value&name2=value2
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

//app.use(session());

// To prevent Cross-site request forgery
//app.use(csrf());

// Enables your server to support HTTP methods that might be unsupported by clients
app.use(methodOverride('_method'));

// Adds the X-Response-Time header with the time in milliseconds from the moment the request entered this middleware.
app.use(responseTime(4));

// Enables you to change the default favorite icon in the browser into a custom one.
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Think about the 'serve-index' as a terminal $ ls command (or dir on Windows)
app.use('/shared', serveIndex(
  path.join('public','shared'),
  {'icons': true}
));

// 配置静态资源路径
app.use(express.static(path.join(__dirname, 'public')));

// The busboy form parser basically takes the incoming HTTP(S) request multipart body and allows us to use its fields,
// uploaded files, and so forth.
app.use('/upload', busboy({immediate: true}));
app.use('/upload', function(request, response) {
  request.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    file.on('data', function(data){
      fs.writeFile('upload' + fieldname + filename, data);
    });
    file.on('end', function(){
      console.log('File' + filename + 'is ended');
    });
  });
  request.busboy.on('finish', function(){
    console.log('Busboy is finished');
    response.status(201).end();
  })
});

// Define routes
app.get(
  '/slow-request',
  timeout('1s'),
  function(request, response, next) {
    setTimeout(function(){
      if (request.timedout) return false;
      return next();
    }, 999 + Math.round(Math.random()));
  }, function(request, response, next) {
    response.send('ok');
  }
);

app.delete('/purchase-orders', function(request, response){
  console.log('The DELETE route has been triggered');
  response.status(204).end();
});

app.get('/response-time', function(request, response){
  setTimeout(function(){
    response.status(200).end();
  }, 2155);
});

app.get('/', function(request, response){
  response.send('Pro Express.js Middleware');
});

app.get('/compression', function(request, response){
  response.render('index');
});

// Apply error handlers
app.use(errorhandler());

// Boot the server
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port: ' + server.address().port);
});