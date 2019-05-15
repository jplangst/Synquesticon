export class TaskObject{

  //   question: "Test question: " + x,
  //   aois: [],
  //   tags: [],
  //   responses: ["first answer", "second answer", "third answer"],
  //   startTimestamp: null,
  //   stopTimestamp: null


  constructor(){
      this.taskType = "";
      this.question = "";
      this.responseType = "";
      this.aois = [];
      this.tags = [];
      this.responses = [];
      this.correctResponses = [];
      this.responseUnit = "";
      this.startTimestamp = null;
      this.stopTimestamp = null;
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
