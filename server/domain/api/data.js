module.exports = function(app) {
  var express = require('express');
  var dataRouter = express.Router();

  var clean = function(pg, message){

    pg.collection('counters').remove({},function(err, result){
      var message = "";
      if(err){
        message += "[error while cleaning " + table.name +", error " + err +"],";
      } else {
        message += "[removed:" + result + " lines from counters],";
      }
      console.log(message);
    });

    data.forEach( function(table){
      pg.collection(table.name).remove({}, function(err, result){
        var message = "";
        if(err){
          message += "[error while cleaning " + table.name +", error " + err +"],";
        } else {
          message += "[removed:" + result + " lines from " + table.name + "],";
        }
        console.log(message);
      });
    });
  };
  var insertAll = function(pg, message){

    data.forEach( function(table){
      pg.collection(table.name).insert(table.data, function(err, result){
        var message = "";
        if(err){
          message += "[error while inserting on " + table.name +", error " + err +"],";
        } else {
          message += "[inserted:" + result + " lines into " + table.name + "],";
        }

        console.log(message);

        console.log('------');
        var counterName = table.name+"id";
        console.log('creating counter for : ' + counterName);
        // sequences
        pg.collection("counters").insert(
          {
            _id: counterName,
            seq: 10
          },
          function(err, result){
            if(err){
              message += "[error while inserting on " + table.name +", error " + err +"],";
            } else {
              message += "[inserted:" + result + " lines into " + table.name + "],";
            }
            console.log(message);
          }
        );

      });




    });
  }
  dataRouter.get('/clean', function(req, res) {
    var pg = req.pg;
    clean(pg);
    res.send("ok");
  });
  dataRouter.get('/reset', function(req, res) {
    var pg = req.pg;
    clean(pg);
    insertAll(pg);
    res.send("ok");
  });
  dataRouter.get('/insertAll', function(req, res) {
    var pg = req.pg;
    insertAll(pg);
    res.send("ok");
  });
  app.use('/api/data', dataRouter);
};
