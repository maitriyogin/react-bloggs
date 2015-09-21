module.exports = function(app) {
  var express = require('express');
  var commentsRouter = express.Router();

  commentsRouter.get('/', function(req, res) {
    var pg = req.pg;
    var query = null;
    pg.find('comments', req.query, pg, res);

  });

  commentsRouter.get('/:id?', function(req, res) {
    var pg = req.pg;
    pg.findById('comments',pg, req.params.id, res);
  });

  commentsRouter.post('/', function(req, res) {
    var pg = req.pg;
    pg.post('comments', pg, res, req.body.comment);
  });

  commentsRouter.delete('/:id', function(req, res) {
    var pg = req.pg;
    pg.delete('comments', req.params.id, pg, res);
  });

  commentsRouter.put('/:id', function(req, res) {
    var pg = req.pg;
    pg.put('comments', pg,  res, req);
  });

  app.use('/api/comments', commentsRouter);
};
