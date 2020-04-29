const fs = require('fs');
const os = require("os");

const dataSchema = require("./data_schema");

const ObserverMessages = dataSchema.ObserverMessages;
ObserverMessages.createIndexes({queryString: "text", tags: "text"});

const Synquestitasks = dataSchema.Synquestitasks;
Synquestitasks.createIndexes({queryString: "text", tags: "text"});

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
                 participantId + ',' +
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

exports.get_many_gaze_data = function (participantIds) {
  var output = [];
  participantIds.map((item, index) => {
    output.push(exports.get_gaze_data(item));
  })
  if (output.length <= 0) {
    return null;
  }
  else {
    return output;
  }
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
  var datestring = d.getFullYear() + '-' + fillZero(d.getMonth() + 1) + '-' + fillZero(d.getDate())
                    + '_' + fillZero(d.getHours()) + '-' + fillZero(d.getMinutes());
  return datestring;
}

function escapeCSV(term){
  //If either is in the term the field must be enclosed in double quotes
  if(term.includes(',') || term.includes('"')){
    //If it contains double quotes the double quotes must be wrapped with more double quotes
    if(term.includes('"')){
      term = term.replace(/"/g , '""');
    }
    term = '"' + term + '"';
  }

  return term;
}

function handleMissingData(dat){
  if(dat === -1) {
    return "NULL";
  }
  else {
    return dat;
  }
}

function handleCorrectlyAnswered(ans){
  if (ans === "correct") {
    return 1;
  }
  else {
    return 0;
  }
}

function handleAcceptedMargin(line){
  if (line.objType === "Numpad Entry") {
    if (line.correctResponses.length > 1) {
      return line.correctResponses[1];
    }
    else {
      return "NULL";
    }
  }
  return "NULL";
}

function handleClickedPoints(points) {
  var text = "";
  points.map((item, index) => {
    var aoi = item.aoi ? item.aoi : "NULL";
    text += aoi + "_" + item.x + "_" + item.y + ";";
  });

  if (text != "") {
    text = text.substring(0, text.length - 1);
  }
  return text;
}

exports.save_to_csv = async function(p, seperator) {
    var globalVariables = "";
    var file_name = "";

    if(p.linesOfData && p.linesOfData.length > 0){
      file_name = formatDateTime(p.linesOfData[0].startTimestamp) + '_';
      file_name += p.linesOfData[0].tasksFamilyTree[0] + '_';
    }

    p.globalVariables.sort((a, b) => a.label.localeCompare(b.label));

    for (let i = 0; i < p.globalVariables.length; i++) {
      /*header += p.globalVariables[i].label + ",";*/
      if (!p.globalVariables[i].label.toLowerCase().includes("record data")) {
        globalVariables += p.globalVariables[i].label + '_' + p.globalVariables[i].value + ":"; /* Was "," but that does not make sense*/
        file_name += p.globalVariables[i].label + '-' + p.globalVariables[i].value + '_';
      }
    }

    if (file_name.length > 0) {
      file_name = file_name.slice(0, -1);
    }

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
      var task = await (Synquestitasks.findOne({_id: line.taskId},
                                  async (err, obj) => {
        if (obj) {
          line.tags = obj.tags;
        }
        else {
          line.tags = [];
        }
      })).catch((exp) => {
        console.log("exp 1");
      });

    })).catch(exp2 => {
      console.log("exp 2", exp2);
    });

    var csv_string = "";

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

      csv_string +=  (escapeCSV(globalVariables) + seperator +
                     escapeCSV(line.taskContent) + seperator +
                     escapeCSV(participantResponse) + seperator +
                     handleCorrectlyAnswered(line.correctlyAnswered) + seperator +
                     escapeCSV(line.correctResponses.join('_')) + seperator +
                     handleAcceptedMargin(line) + seperator +
                     handleMissingData(line.timeToFirstAnswer) + seperator +
                     handleMissingData(line.timeToCompletion) + seperator +
                     escapeCSV(commentText) + seperator +
                     escapeCSV(line.tags.join('_')) + seperator +
                     escapeCSV(line.objType) + seperator +
                     escapeCSV(line.tasksFamilyTree.join('_')) + seperator +
                     getFormattedTime(line.startTimestamp) + seperator + //Remove linebreaks and extra whitespace
                     getFormattedTime(line.firstResponseTimestamp)).replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ") + seperator +
                     handleClickedPoints(line.clickedPoints) + seperator +
                     p._id + os.EOL;
    });

    return [file_name, csv_string]
  }
