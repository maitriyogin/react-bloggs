module.exports = function(app) {
  var globSync = require('glob').sync;
  var bodyParser = require('body-parser');
  var api = globSync('./api/**/*.js', {cwd: __dirname}).map(require);
  var proxies = globSync('./proxies/**/*.js', {cwd: __dirname}).map(require);
  var data = globSync('./data/**/*.js', {cwd: __dirname}).map(require);

  var pg = require('pg');

  var connectionString = app.isProduction ? process.env.DATABASE_URL : "pg://stephenwhite:5432@localhost/stephenwhite"

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Database

  pg.findById = function(name, pg, id, res){

    pg.connect(connectionString, function(err, client, done) {

      client.query('SELECT * FROM ' + name + ' WHERE _id=' + id, function(err, result) {
        done();
        var ret = {};
        if (err){
          console.error(err); res.send("Error " + err);
        }
        else {
          ret[name] = result.rows;
          res.send( ret );
        }
      });
    });
  };

  pg.find = function(name, query, pg, res){
    if(query){
      var qs = ' WHERE ';
      // convert query into sql, should be name values
      console.log('query : ' + JSON.stringify(query, null, 2) );
      var i = 0;
      for(var property in query){
        if(i>0){
          qs += ', ';
        }
        if(isNaN(query[property])) {
          qs += property + ' LIKE \'%' + query[property] + '%\'';
        } else {
          qs += property + '=' + query[property];
        }
        i++;
      }
      qs = 'SELECT * FROM ' + name + qs;
      console.log('find : ' + qs);
      pg.connect(connectionString, function(err, client, done) {
        try {
          client.query(qs, function(err, result) {
            done();
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
            }
            else {
              ret[name] = result.rows;
              res.send(ret);
            }
          });
        } catch (err){
          console.error(err);
          res.send("Error " + err);
        }
      });
    } else {
      pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM ' + name, function(err, result) {
          done();
          var ret = {};
          if (err){
            console.error(err); res.send("Error " + err);
          }
          else {
            ret[name] = result.rows;
            res.send( ret );
          }
        });
      });
    }
  }

  pg.put = function(name, pg, res, req){
    if(req.body && req.body[name]){

      var payload = req.body[name];
      console.log("payload" + JSON.stringify(payload));
      var _id;
      if(payload._id !== undefined){
        _id = payload._id;
        delete payload._id;
      }
      // create update
      var sets = 'SET ';
      var i = 0;
      for (var property in payload) {
        if (payload.hasOwnProperty(property)) {
          if(i>0){
            sets += ','
          }
          i++;
          sets += property + '=' + payload[property];
        }
      }
      var sql = 'UPDATE ' + name + sets + ' WHERE _id=' + _id;
      pg.connect(connectionString, function(err, client, done) {
        client.query(sql, function(err, result) {
          done();
          var ret = {};
          if (err){
            console.error(err); res.send("Error " + err);
          }
          else {
            pg.findById(name, pg, _id, res);
          }
        });
      });

    } else {
      var obj = {};
      obj[name] = '';
      res.send(obj);
    }
  };

  pg.post = function(name, pg, res, req){
    if(req.body && req.body[name]){

      var payload = req.body[name];
      console.log("payload" + JSON.stringify(payload));
      var _id;
      if(payload._id !== undefined){
        _id = payload._id;
        delete payload._id;
      }
      // create update
      var columns = '(';
      var values = ' VALUES(';
      var i = 0;
      for (var property in payload) {
        if (payload.hasOwnProperty(property)) {
          if(i>0){
            values += ',';
            columns += ',';
          }
          i++;
          values += payload[property];
          columns += property;
        }
      }
      values += ')';
      columns += ')';

      var sql = 'INSERT INTO ' + COLUMNS + VALUES;
      pg.connect(connectionString, function(err, client, done) {
        client.query(sql, function(err, result) {
          done();
          var ret = {};
          if (err){
            console.error(err); res.send("Error " + err);
          }
          else {
            pg.findById(name, pg, _id, res);
          }
        });
      });

    } else {
      var obj = {};
      obj[name] = '';
      res.send(obj);
    }
  };

  pg.delete = function(name, id,  pg, res){
    pg.connect(connectionString, function(err, client, done) {
      client.query('DELETE FROM ' + name + ' WHERE _id=' + id, function(err, result) {
        done();
        var ret = {};
        if (err){
          console.error(err); res.send("Error " + err);
        }
        else {
          res.send((result === 1) ? {  } : { msg:'error: ' + err });
        }
      });
    });
  };

  app.use(function(req, res, next) {
    req.pg = pg;
    next();
  });

  api.forEach(function(route) {
    route(app);
  });

  // proxy expects a stream, but express will have turned
  // the request stream into an object because bodyParser
  // has run. We have to convert it back to stream:
  // https://github.com/nodejitsu/node-http-proxy/issues/180
  app.use(require('connect-restreamer')());
  proxies.forEach(function(route) {
    route(app);
  });
};
