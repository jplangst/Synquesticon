//Import this file to connect to the DB

var MongoClient = require('mongdb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/webEntryDb", function(err, db) {
  if(!err) {
    console.log("we are connected to mongodb");
  }
});
