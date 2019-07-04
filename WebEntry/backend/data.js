// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
objType: Task, TaskSet
*/

/*
taskType: Instruction, Text Entry, Multiple Choice, Image
*/

// this will be our data base's data structure
const TaskSchema = new Schema(
  {
    id: String, //The id of the Task
    taskType: String, //The type of the task
    question: String, //Used if the task type is "Text Entry" and "Choice" //it's the body
    globalVariable: Boolean, //If true the response of the task should be stored as a global var in the participant DB object
    instruction: String,
    image: String, //filepath
    aois: [{
      name: String,
      boundingbox: [[Number]],
      _id: false
    }], //A list of AOIs relevant to the task
    tags: [String], //A list of searchable tags
    responses: [String], //The possible responses to the task
    correctResponses: [String], //The correct response
    responseUnit: String, //The unit of the response e.g. "%", "RPM"
    refSets: [String], //list of sets that reference to this questions
    objType: String
  }, {
    collection: 'Tasks'
  }
);

const TaskSetSchema = new Schema({
  id: String, //The id of the TaskSet
  name: String, //The name for the TaskSet
  tags: [String], //A list of searchable tags
  childIds: [{
    id: String,
    objType: String,
    _id: false
  }], //list of the task ids referenced by this set
  setTaskOrder: String, //In Order, Random
  counterbalancingOrder: [Number], //List of the order the tasks should be played
  objType: String
}, {
  collection: 'TaskSets'
});

const ParticipantSchema = new Schema(
  {
    readableId: String,
    taskSetId: String,
    eyeData: String,
    answers: [{
      taskId: String,
      question: String,
      response: [String],
      correctResponse: [String],
      startTimestamp: Number, //The start timestamp
      answerTimestamp: Number, //The end timestamp
      aois: [{
        label: String,
        checked: Boolean
      }]
    }]
  }, {
    collection: 'Participants'
  }
);

const ExperimentSchema = new Schema(
  {
    readableId: String,
    participantIds: [String]
  }, {
    collection: 'Experiments'
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = {
  Tasks: mongoose.model("Tasks", TaskSchema),
  TaskSets: mongoose.model("TaskSets", TaskSetSchema),
  Participants: mongoose.model("Participants", ParticipantSchema),
  Experiments: mongoose.model("Experiments", ParticipantSchema)
};
