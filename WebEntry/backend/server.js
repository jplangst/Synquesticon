const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

//var ObjectID = require('mongodb').ObjectID;


const dataSchema = require("./data");
const Question = dataSchema.Question;
Question.createIndexes({queryString: "text", tags: "text"});
const Set = dataSchema.Set;
Set.createIndexes({queryString: "text", tags: "text"});

const API_PORT = 3001;
const app = express();
const router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/webEntryDb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

// this is our MongoDB database
const dbRoute = url;

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

/*********************************************************
 **                    DATA functions                    *
 *********************************************************/
 // this method fetches all available questions in our database
router.get("/getAllQuestions", (req, res) => {
  Question.find((err, data) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, questions: data });
  });
});

router.post("/getQuestionWithID", (req, res) => {
  const { id } = req.body;
  Question.findOne({_id: id}, (err, obj) => {
    if (err) {
      return res.json({success: false, error: err});
    }
    console.log(err, obj);
    return res.json({success: true, question: obj});
  });
});

router.post("/getAllQuestionContaining", (req, res) => {
  const { queryCollection, queryString } = req.body;

  var collection = null;
  if(queryCollection === 'Tasks'){
    collection = Question;
  }
  else{
    collection = Set;
  }

  collection.find( {$or:[{'question': {"$regex" : queryString, "$options":"i"}},
  {'tags': {"$regex" : queryString, "$options":"i"}}]}, (err, data) => {
    if (err) {
      console.log(err);
      return res.json({success: false, error: err});
    }
    console.log("Data retrieved ", err, data);
    return res.json({success: true, tasks: data});
  });
});

// this method adds new question in our database
router.post("/addQuestion", (req, res) => {
  const { message } = req.body;
  var obj = JSON.parse(message);
  let question = new Question({
    question: obj.question,
    aois: obj.aois,
    tags: obj.tags,
    responses: obj.responses,
    startTimestamp: obj.startTimestamp,
    stopTimestamp: obj.stopTimestamp,
    refSets: []
  });

  question.save((err, q) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, _id: q._id });
  });
});

// this method modifies existing question in our database
router.post("/updateQuestion", (req, res) => {
  const { id, message } = req.body;
  var obj = JSON.parse(message);
  Question.findOneAndUpdate({_id: id}, obj, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this method deletes existing question in our database
router.post("/deleteQuestion", (req, res) => {
  const { id } = req.body;

  Set.updateMany({ }, { $pull: {questions: id}}, err => {

  })
  Question.findOneAndDelete({_id: id}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });

  //remove this question from all sets

});

router.delete("/deleteAllQuestions", (req, res) => {
  Question.deleteMany({}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
})

//---------------SET----------------
router.get("/getAllSets", (req, res) => {
  Set.find((err, data) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, sets: data });
  });
});

router.post("/getSetWithID", (req, res) => {
  const { id } = req.body;
  Set.findOne({_id: id}, (err, obj) => {
    if (err) {
      return res.json({success: false, error: err});
    }
    console.log(err, obj);
    return res.json({success: true, set: obj});
  });
});

router.post("/addSet", (req, res) => {
  const { id, message } = req.body;
  var obj = JSON.parse(message);
  let set = new Set({
    name: obj.name,
    questions: [] //list questions belong to this set
  });

  set.save((err, s) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, _id: s._id });
  });
});

// this method modifies existing question in our database
router.post("/updateSet", (req, res) => {
  const { id, message } = req.body;
  var obj = JSON.parse(message);
  Set.findOneAndUpdate({_id: id}, obj, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/addQuestionToSet", (req, res) => {
  const { setId, questionId} = req.body;
  Set.updateOne({_id: setId}, { $addToSet: {questions: questionId}}, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
})

router.post("/removeQuestionFromSet", (req, res) => {
  const { setId, questionId } = req.body;
  Set.updateOne({_id: setId}, { $pull: {questions: questionId}}, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  })
})

// this method deletes existing question in our database
router.post("/deleteSet", (req, res) => {
  const { id } = req.body;
  Set.findOneAndDelete({_id: id}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.delete("/deleteAllSets", (req, res) => {
  Set.deleteMany({}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
})

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
