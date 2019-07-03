export class TaskObject{
  constructor(){
      this.taskType = "Multiple Choice";
      this.question = "";
      this.singleChoice = false;
      this.instruction = "";
      this.image = "";
      //this.responseType = "Single Choice";
      this.aois = [];
      this.tags = [];
      this.responses = [];
      this.correctResponses = [];
      this.responseUnit = "";
      this.objType = "Task";
  }
}

export class TaskSetObject{
  constructor(){
      this.name = "";
      this.tags = [];
      this.childIds = [];
      this.setTaskOrder = "InOrder";
      this.counterbalancingOrder = [];
      this.objType = "TaskSet";
  }
}
