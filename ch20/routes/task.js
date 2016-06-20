module.exports.list = function (req, res, next) {
  req.db.tasks.find({
    completed: false
  }).toArray(function (error, tasks) {
    if (error) return next(error);
    res.render('tasks', {
      title: 'Todo List',
      tasks: tasks || []
    });
  });
};

module.exports.completed = function(req, res, next) {
  req.db.tasks.find({
    completed: true
  }).toArray(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};

module.exports.add = function (req, res, next) {
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  req.db.tasks.save({name: req.body.name, completed: false}, function (error, task) {
    if (error) return next(error);
    if (!task) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', task.name, task._id);
    res.redirect('/tasks');
  })
};

module.exports.markAllCompleted = function (req, res, next) {
  if (req.body.all_done !== 'true') return next(new Error('Param\'s value is not "true".'));
  req.db.tasks.update({completed: false}, {$set: {completed: true}}, {multi: true}, function (error, count) {
    if (error) return next(error);
    console.info('Marked %s task(s) completed.', count);
    res.redirect('/tasks');
  });
};

module.exports.markCompleted = function (req, res, next) {
  if (req.body.completed !== 'true') return next(new Error('Param\'s value is not "true".'));
  req.db.tasks.updateById(req.task._id, {$set: {completed: true}}, function (error, count) {
    if (error) return next(error);
    if (count !== 1) return next(new Error('Something went wrong'));
    console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
    res.redirect('/tasks');
  })
};

module.exports.del = function (req, res, next) {
  req.db.tasks.removeById(req.task._id, function (error, count) {
    if (error) return next(error);
    if (count !== 1) return next(new Error('Something went wrong.'));
    console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
    res.status(204).send();
  });
};
