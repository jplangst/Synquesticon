import store from './store';
import * as dbObjectsUtilityFunctions from './db_objects_utility_functions';

export function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

export function stringifyWAMPMessage(obj, timestamp, type) {
  if (type === "START") {
    var globalVariable = obj.globalVariable ? " (global variable) " : "";
    var message = obj.taskType + " \"" +
                  dbObjectsUtilityFunctions.getTaskContent(obj) + "\"" + globalVariable;

    //Event type (0), task content (1), startTimestamp (2), remoteTracker (3)
    return ["START",
                obj.taskType,
                dbObjectsUtilityFunctions.getTaskContent(obj),
                obj.globalVariable,
                timestamp,
                store.getState().experimentInfo.selectedTracker];
  }
  else if (type === "NEXT") {
    return ["ANSWERED",
                obj.firstResponseTimestamp,
                obj.timeToFirstAnswer,
                obj.timeToCompletion,
                obj.responses,
                obj.correctlyAnswered,
                obj.aoiCheckedList];
  }
  else if (type === "SKIP") {
    return ["SKIPPED",
                obj.timeToCompletion];
  }
  return null;
}
