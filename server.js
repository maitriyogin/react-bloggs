var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
//var bloggsDomain = require('./server/domain/index.js');

var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
}); 



var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'dist');

app.use(express.static(publicPath));

app.all('/db/*', function (req, res) {
  proxy.web(req, res, {
    target: 'https://glowing-carpet-4534.firebaseio.com/'
  });
});

var pg = require('pg');

var connectionString = isProduction ? process.env.DATABASE_URL : "pg://stephenwhite:5432@localhost/stephenwhite"
app.get('/api/users', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM users', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { res.send( {users: result.rows} ); }
    });
  });
})

if (!isProduction) {

  var bundle = require('./server/bundle.js');
  bundle();
  
  //bloggsDomain(app);
  
  app.get('/hi', function (req, res) {
    res.send('Hello World!');
  });
  
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://127.0.0.1:3001'
    });
  });
  
  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:3001'
    });
  });

  proxy.on('error', function(e) {
    // Just catch it
  });

  // We need to use basic HTTP service to proxy
  // websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('Server running on port ' + port);
  }); 

} else {

  // And run the server
  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}



