module.exports = function(app) {
  var express = require('express');
  var postsRouter = express.Router();

  postsRouter.get('/', function(req, res) {
    var pg = req.pg;
    var query = null;
    pg.find('posts', req.query, pg, res);
  });

  postsRouter.get('/:id?', function(req, res) {
    var pg = req.pg;
    pg.findById('posts',pg, req.params.id, res);
  });

  postsRouter.post('/', function(req, res) {
    var pg = req.pg;
    pg.post('posts', pg, res, req.body.post);
  });

  postsRouter.delete('/:id', function(req, res) {
    var pg = req.pg;
    pg.delete('posts', req.params.id, pg, res);
  });

  postsRouter.put('/:id', function(req, res) {
    var pg = req.pg;
    pg.put('posts', pg,  res, req);
  });

  app.use('/api/posts', postsRouter);
};
