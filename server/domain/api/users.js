module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();


  usersRouter.get('/', function(req, res) {
    var pg = req.pg;
    pg.find('users', req.query, pg, res);
  });

  usersRouter.get('/:id?', function(req, res) {
    var pg = req.pg;
    pg.findById('users',pg, req.params.id, res);
  });

  usersRouter.post('/', function(req, res) {
    var pg = req.pg;
    pg.post('users', pg, res, req.body.user);
  });

  usersRouter.delete('/:id', function(req, res) {
    var pg = req.pg;
    pg.delete('users', req.params.id, pg, res);
  });

  usersRouter.put('/:id', function(req, res) {
    var pg = req.pg;
    pg.put('users', pg,  res, req);
  });

  app.use('/api/users', usersRouter);
};
