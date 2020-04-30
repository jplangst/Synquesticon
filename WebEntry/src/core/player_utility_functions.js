export function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

export function getFormattedCurrentTime() {
  var dt = new Date();
  var currentTime = dt.toUTCString();
  return currentTime;
}

export function getFormattedTime(dt) {
  var date = new Date(dt);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var milliseconds = date.getMilliseconds();

  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds;
  return formattedTime;
}

var myStorage = window.localStorage;
export function getDeviceName() {
  return myStorage.getItem('deviceID');
}

export function pointIsInPoly(p, polygon) {
    var isInside = false;

    var minX = polygon[0][0], maxX = polygon[0][0];
    var minY = polygon[0][1], maxY = polygon[0][1];
    for (var n = 1; n < polygon.length; n++) {
        var q = polygon[n];
        minX = Math.min(q[0], minX);
        maxX = Math.max(q[0], maxX);
        minY = Math.min(q[1], minY);
        maxY = Math.max(q[1], maxY);
    }

    if (p[0] < minX || p[0] > maxX || p[1] < minY || p[1] > maxY) {
        return false;
    }

    //copyright: https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    var i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ( (polygon[i][1] > p[1]) !== (polygon[j][1] > p[1]) &&
                p[0] < (polygon[j][0] - polygon[i][0]) * (p[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0] ) {
            isInside = !isInside;
        }
    }

    return isInside;
}

export function getAllImagePaths(taskList){
  var result = getImagePath(taskList, []);
  return result;
}

function getImagePath(dataList, imageFiles){
  dataList.forEach(function(data){
    if(data.taskType==="TaskSet"){
      getImagePath(data.data, imageFiles);
    }
    else if(data.taskType==="Image"){
      imageFiles.push("/Images/" + data.image);
    }
    else if(data.taskType==="Comparison"){
      data.subTasks.forEach(function(subTask){
        if(subTask.subType==="Image"){
          imageFiles.push("/Images/" + subTask.image);
        }
      });
    }
  });
  return imageFiles;
}

export function stringifyMessage(store, task, lineOfData, eventType, progressCount, taskIndex) {
  try {
    if (store.getState().experimentInfo.participantId === undefined) {
      console.log("PaarticipantID is undefined");
      return null;
    }

    let messageObject = {
      eventType: eventType,
      participantId: store.getState().experimentInfo.participantId,
      participantLabel: store.getState().experimentInfo.participantLabel,
      startTimestamp: store.getState().experimentInfo.startTimestamp,
      selectedTracker: store.getState().experimentInfo.selectedTracker,
      task: task,
      lineOfData: lineOfData,
      taskSetCount: store.getState().experimentInfo.taskSetCount,
      progressCount: progressCount,
      taskIndex: taskIndex
    };
    return JSON.stringify(messageObject);
  } catch (err) {
    // return JSON.stringify({
    //                         eventType: eventType,
    //                         participantId: store.getState().experimentInfo.participantId,
    //                         participantLabel: store.getState().experimentInfo.participantLabel,
    //                         startTimestamp: store.getState().experimentInfo.startTimestamp,
    //                         selectedTracker: store.getState().experimentInfo.selectedTracker,
    //                         task: task,
    //                         lineOfData: lineOfData,
    //                         taskSetCount: store.getState().experimentInfo.taskSetCount,
    //                         progressCount: progressCount,
    //                         taskIndex: taskIndex
    //                       });
    return null;
  }
}
