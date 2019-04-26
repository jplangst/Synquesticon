// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const QuestionSchema = new Schema(
  {
    id: String,
    taskType: String,
    question: String,
    responseType: String,
    aois: [String],
    tags: [String],
    responses: [String],
    correctResponse: String,
    responseUnit: String,
    startTimestamp: Number,
    stopTimestamp: Number,
    refSets: [String], //list of sets that reference to this questions
  }, {
    collection: 'questions'
  }
);

const SetSchema = new Schema({
  id: String,
  name: String,
  questions: [String] //list questions belong to this set
}, {
  collection: 'sets'
});

// export the new Schema so we could modify it using Node.js
module.exports = {
  Question: mongoose.model("Question", QuestionSchema),
  Set: mongoose.model("Set", SetSchema)
};
