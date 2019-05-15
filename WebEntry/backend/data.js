// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const TaskSchema = new Schema(
  {
    id: String, //The id of the Task
    taskType: String, //The type of the task
    question: String, //Used if the task type is "Question"
    responseType: String, //Determines the response type of the Task e.g. "Multiple choice", "Single choice"
    aois: [String], //A list of AOIs relevant to the task
    tags: [String], //A list of searchable tags
    responses: [String], //The possible responses to the task
    correctResponse: String, //The correct response
    responseUnit: String, //The unit of the response e.g. "%", "RPM"
    startTimestamp: Number, //The start timestamp
    stopTimestamp: Number, //The end timestamp
    refSets: [String], //list of sets that reference to this questions
  }, {
    collection: 'Tasks'
  }
);

const TaskSetSchema = new Schema({
  id: String, //The id of the TaskSet
  name: String, //The name fo the TaskSet
  tags: [String], //A list of searchable tags
  taskIds: [String], //list of the task ids referenced by this set
  counterbalancingOrder: [Number] //List of the order the tasks should be played
}, {
  collection: 'TaskSets'
});

// export the new Schema so we could modify it using Node.js
module.exports = {
  Question: mongoose.model("Tasks", TaskSchema),
  Set: mongoose.model("TaskSets", TaskSetSchema)
};
