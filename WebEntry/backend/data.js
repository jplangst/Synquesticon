// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const TaskSchema = new Schema(
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
    collection: 'Tasks'
  }
);

const TaskSetSchema = new Schema({
  id: String,
  name: String,
  questions: [String] //list questions belong to this set
}, {
  collection: 'TaskSets'
});

// export the new Schema so we could modify it using Node.js
module.exports = {
  Question: mongoose.model("Task", TaskSchema),
  Set: mongoose.model("TaskSet", TaskSetSchema)
};
