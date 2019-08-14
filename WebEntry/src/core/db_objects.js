
/**
 * The default object used for Tasks. New tasks should use this as the base.
 */
export class TaskObject {
  constructor(){
    this.taskType = "Multiple Choice";
    this.question = "";
    this.globalVariable = false;
    this.instruction = "";
    this.image = "";
    this.aois = [];
    this.tags = [];
    this.responses = [];
    this.correctResponses = [];
    this.responseUnit = "";
    this.objType = "Task";
  }
}

/**
 * The default object used for Sets. New sets should use this as the base.
 */
export class TaskSetObject {
  constructor(){
    this.name = "";
    this.tags = [];
    this.childIds = [];
    this.setTaskOrder = "InOrder";
    this.displayOnePage = false; //If true display all the tasks on one page
    this.logOneLine = false; //If true log all the tasks in one line
    this.counterbalancingOrder = [];
    this.objType = "TaskSet";
  }
}

/**
 *  The default object used for Participants. New participants should use this as the base.
 */
export class ParticipantObject {
  constructor(mainTaskSetId) {
    var dt = new Date();
    this.readableId = dt.getTime();
    this.mainTaskSetId = mainTaskSetId;
    this.eyeData = "";
    this.linesOfData = [];
    this.globalVariables = [];
  }
}

/**
 * The default object used for LineOfData. New lines of data should use this as the base.
 */
export class LineOfData {
  constructor(currentTime, taskId, familyTree, taskContent, taskCorrectResponses) {
    this.tasksFamilyTree = familyTree;
    this.taskId = taskId;
    this.taskContent = taskContent;
    this.responses = [];
    this.correctResponses = taskCorrectResponses;
    /* correctlyAnswered:
    1. If the participant answers correctly, we log it as “correct”.
    2. If the participant answers incorrectly, we log it as “incorrect”.
    3. If no correct answer was provided (i.e. the field “correct answer” in the editor is empty), we log it as “notApplicable”.
    4. If the participant clicked “skip”, we log it as “skipped”, regardless of (3).
    */
    this.correctlyAnswered = "skipped";

    this.startTimestamp = currentTime;
    /*
    raw timestamp for every response
    */
    this.firstResponseTimestamp = -1; //The end timestamp
    /* timeToFirstAnswer
    time from when the question was presented to first input
    - for buttons: to when first button is pressed
    - for text entry: to when first letter is entered ("oninput")
    */
    this.timeToFirstAnswer = -1;
    /* timeToCompletion
    time from when the question was presented to clicking "next"
    In case of "skipped", we leave (1) empty and log (2) as time to pressing "skip".
    */
    this.timeToCompletion = -1;
    this.aoiCheckedList = [];
  }
}
