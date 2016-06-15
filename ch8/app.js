var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var filePath = path.join(__dirname, 'files', 'Lighthouse.jpg');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.locals.lang = 'zh_cn';
app.locals.author = 'xiufu.yuan';

app.get('/render', function (req, res) {
  res.render('render', {title: 'Pro Express.js'});
});

app.get('/locals', function (req, res) {
  res.locals = {title: 'Pro Express.js from Locals'};
  res.render('render');
});

app.get('/set-html', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.end('<html><body><h1>Express.js Guide</h1></body></html>');
});

app.get('/set-csv', function (req, res) {
  var body = 'title, tags\n' +
    'Practical Node.js, node.js express.js\n' +
    'Rapid Prototyping with JS, backbone.js node.js mongodb\n' +
    'JavaScript: The Good Parts, javascript\n';

  res.set({
    'Content-Type': 'text/csv',
    'Content-Length': body.length,
    'Set-Cookie': ['type=reader', 'language=javascript']
  });

  res.end(body);
});

app.get('/status', function (req, res) {
  res.status(200).end();
});

app.get('/send-ok', function (req, res) {
  res.status(200).send({message: 'Data was submitted successfully.'});
});

app.get('/send-err', function (req, res) {
  res.status(500).send({message: 'Oops, the server is down.'});
});

app.get('/send-buf', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(new Buffer('text data that will be converted into Buffer'));
});

app.get('/json', function (req, res) {
  res.status(200).json([
    {title: 'Practical Node.js', tags: 'node.js express.js'},
    {title: 'Rapid Prototyping with JS', tags: 'backbone.js node.js mongodb'},
    {title: 'JavaScript: The Good Parts', tags: 'javascript'}
  ]);
});

app.get('/jsonp', function (req, res) {
  res.status(200).jsonp([
    {title: 'Express.js Guide', tags: 'node.js express.js'},
    {title: 'Rapid Prototyping with JS', tags: 'backbone.js, node.js, mongodb'},
    {title: 'JavaScript: The Good Parts', tags: 'javascript'}
  ]);
});

app.get('/non-stream1', function (req, res) {
  res.send(fs.readFileSync(filePath));
});

app.get('/non-stream2', function (req, res) {
  fs.readFile(filePath, function (error, data) {
    res.end(data);
  });
});

app.get('/stream1', function (req, res) {
  fs.createReadStream(filePath).pipe(res);
});

app.get('/stream2', function (req, res) {
  var stream = fs.createReadStream(filePath);
  stream.on('data', function (data) {
    res.write(data);
  });
  stream.on('end', function () {
    res.end()
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
