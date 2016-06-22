var http = require('http');
var path = require('path');

var express = require('express');
var mongoskin = require('mongoskin');

var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var errorHandler = require('errorhandler');

var app = express();
var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe: true});

app.use(function (req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  return next();
});

app.param('task_id', function (req, res, next, taskId) {
  req.db.tasks.findById(taskId, function (error, task) {
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

var routes = require('./routes/index');
var tasks = require('./routes/task');

app.locals.appname = 'Express.js Todo App';

app.set('port', process.env.PORT || 3010);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join('public', 'favicon.ico')));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: true,
  saveUninitialized: true
}));
app.use(csrf());
app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  return next();
});

app.get('/', routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted)
app.post('/add', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.delete('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

app.all('*', function (req, res) {
  res.status(404).send();
});

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
