export class TaskObject{

  //   question: "Test question: " + x,
  //   aois: [],
  //   tags: [],
  //   responses: ["first answer", "second answer", "third answer"],
  //   startTimestamp: null,
  //   stopTimestamp: null


  constructor(){
      this.taskType = "Question";
      this.question = "";
      this.responseType = "Single Choice";
      this.aois = [];
      this.tags = [];
      this.responses = [];
      this.correctResponses = [];
      this.responseUnit = "";
      this.objType = "Task";
  }

  setQuestion(question){
    this.question = question;
  }
}

export class TaskSetObject{
  constructor(){
      this.name = "";
      this.tags = [];
      this.taskIds = [];
      this.counterbalancingOrder = [];
      this.objType = "TaskSet";
  }

  addTask(task){
    this.taskIds.push(task);
  }
}
