const fs = require('fs');
const os = require("os");

const dataSchema = require("./data_schema");

const ObserverMessages = dataSchema.ObserverMessages;
ObserverMessages.createIndexes({queryString: "text", tags: "text"});

var exports = module.exports = {};

var DATA_DIRECTORY = "exported_data/";
var GAZE_DATA_PREFIX = "gaze_data_";
var RAW_GAZE_DATA_DIRECTORY = "raw_gaze_data/";

function getFormattedTime(dt) {
  var date = new Date(dt);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var milliseconds = date.getMilliseconds();

  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds;
  return formattedTime;
}

exports.save_gaze_data = function (participantId, task, gazeData) {
  if (!fs.existsSync(RAW_GAZE_DATA_DIRECTORY)){
    fs.mkdirSync(RAW_GAZE_DATA_DIRECTORY);
  }

  var gaze_timestamp = gazeData ? gazeData[0].timestamp : "";

  var file_name = RAW_GAZE_DATA_DIRECTORY + gaze_timestamp + GAZE_DATA_PREFIX + participantId;
  var logger = fs.createWriteStream(file_name, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });

  if (!fs.existsSync(file_name)) {
    var header = "Timestamp(UTC),X,Y,Left pupil radius,Right pupil radius,Task,Target";
    logger.write(header + os.EOL);
  }

  var target = "";
  if (row.target != undefined) {
    target = row.target.name + ',';
    row.target.boundingbox.map((p, ind) => {
      target += p[0] + '_' + p[1] + ';'
    });
  }
  else {
    target = ',';
  }

  gazeData.map((row, index) => {
    logger.write(row.timestamp + ',' +
                 row.locX + ',' +
                 row.locY + ',' +
                 row.leftPupilRadius + ',' +
                 row.rightPupilRadius + ',' +
                 task + ',' +
                 target + os.EOL);
  })
  logger.end();
}

exports.get_gaze_data = function (participantId) {
  var gazeDataFile = RAW_GAZE_DATA_DIRECTORY + GAZE_DATA_PREFIX + participantId;
  if (fs.existsSync(gazeDataFile)) {
    return fs.readFileSync(gazeDataFile);
  }
  return null;
}


/*
██████   ██████  ██     ██ ███    ██ ██       ██████   █████  ██████   █████  ██████  ██      ███████
██   ██ ██    ██ ██     ██ ████   ██ ██      ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██      ██
██   ██ ██    ██ ██  █  ██ ██ ██  ██ ██      ██    ██ ███████ ██   ██ ███████ ██████  ██      █████
██   ██ ██    ██ ██ ███ ██ ██  ██ ██ ██      ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██      ██
██████   ██████   ███ ███  ██   ████ ███████  ██████  ██   ██ ██████  ██   ██ ██████  ███████ ███████
*/

function formatDateTime(t) {
  var d = new Date(t);
  var fillZero = (num) => {
    if (num < 10) {
      return '0' + num;
    }
    else {
      return num;
    }
  }
  var datestring = d.getFullYear() + '-' + fillZero(d.getMonth()) + '-' + fillZero(d.getDate())
                    + '_' + fillZero(d.getHours()) + '-' + fillZero(d.getMinutes());
  return datestring;
}

exports.save_to_csv = async function(p) {
    var globalVariables = "";
    var file_name = "";

    if(p.linesOfData && p.linesOfData.length > 0){
      file_name = formatDateTime(p.linesOfData[0].startTimestamp) + '_';
      file_name += p.linesOfData[0].tasksFamilyTree[0] + '_';
    }

    for (let i = 0; i < p.globalVariables.length; i++) {
      /*header += p.globalVariables[i].label + ",";*/
      if (!p.globalVariables[i].label.toLowerCase().includes("record data")) {
        globalVariables += p.globalVariables[i].label + '_' + p.globalVariables[i].value + ":"; /* Was "," but that does not make sense*/
        file_name += p.globalVariables[i].label + '-' + p.globalVariables[i].value + '_';
      }
    }

    //prepare the header
    //var header = "Global variables,Family Tree,Task type,Task content,Start timestamp(UTC),First response timestamp(UTC),Time to first answer(ms),Time to completion(ms),Answer,Correctly answered,Correct answers,Comments";
    var header = "global_vars,question,answer,answered_correctly,time_to_first_response,time_to_completion,comments,set_names,task_type,timestamp_start,timestamp_first_response";
    if (file_name === "") {
      file_name = "Anonymous";
    }

    // var gazeDataFile = RAW_GAZE_DATA_DIRECTORY + GAZE_DATA_PREFIX + p._id;
    //file_name += ".csv";

    await Promise.all(p.linesOfData.map(async (line, index) => {
      //get all comments on this line
       var comments = await (ObserverMessages.find({participantId: p._id,
                                   taskId: line.taskId,
                                   startTaskTime: line.startTimestamp},
                                  async (err, obj) => {

        if (obj.length > 0) {
          line.comments = obj;
        }

      })).catch((exp) => {
        console.log("exp 1");
      });

    })).catch(exp2 => {
      console.log("exp 2");
    });

    var csv_string = header + os.EOL;

    p.linesOfData.map((line, index) => {
      var comments = [];
      if (line.comments != undefined) {
        line.comments.map((obs, obsInd) => {
          obs.messages.map((msg, msgInd) => {
            comments.push(obs.name + ": " + msg);
          })
        })
      }

      var commentText = "";
      if (comments.length > 0) {
        commentText = comments.join(';');
      }

      var participantResponse = "";
      if(line.responses.length > 0){
        participantResponse = line.responses.join(';');
      }

      var handleMissingData = (dat) => {
        if(dat === -1) {
          return "NULL";
        }
        else {
          return dat;
        }
      }

      var handleCorrectlyAnswered = (ans) => {
        if (ans === "correct") {
          return 1;
        }
        else {
          return 0;
        }
      }

      // csv_string += '"'+globalVariables + '",' +
      //              '"'+line.tasksFamilyTree.join('_') + '",' +
      //              '"'+line.displayType + '",' +
      //              '"'+line.taskContent + '",' +
      //              '"'+getFormattedTime(line.startTimestamp) + '",' +
      //              '"'+getFormattedTime(line.firstResponseTimestamp) + '",' +
      //              '"'+handleMissingData(line.timeToFirstAnswer) + '",' +
      //              '"'+handleMissingData(line.timeToCompletion) + '",' +
      //              '"'+participantResponse + '",' +
      //              '"'+line.correctlyAnswered + '",' +
      //              '"'+line.correctResponses + '",' +
      //              '"'+commentText +'"'+ os.EOL;

      csv_string += '"'+globalVariables + '",' +
                   '"'+line.taskContent + '",' +
                   '"'+participantResponse + '",' +
                   '"'+handleCorrectlyAnswered(line.correctlyAnswered) + '",' +
                   '"'+line.correctResponses + '",' +
                   '"'+handleMissingData(line.timeToFirstAnswer) + '",' +
                   '"'+handleMissingData(line.timeToCompletion) + '",' +
                   '"'+commentText + '",' +
                   '"'+line.tasksFamilyTree.join('_') + '",' +
                   '"'+line.displayType + '",' +
                   '"'+getFormattedTime(line.startTimestamp) + '",' +
                   '"'+getFormattedTime(line.firstResponseTimestamp) +'"'+ os.EOL;
    });

    return [file_name, csv_string]
  }
