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
  }

  setQuestion(question){
    this.question = question;
  }
}

export class TaskSetObject{
  constructor(){
      this.taskSetName = "";
      this.tags = [];
      this.tasks = [];
  }

  addTask(task){
    this.tasks.add(task);
  }
}
