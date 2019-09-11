const fs = require('fs');
const os = require("os");

const dataSchema = require("./data_schema");

const ObserverMessages = dataSchema.ObserverMessages;
ObserverMessages.createIndexes({queryString: "text", tags: "text"});

var exports = module.exports = {};

var DATA_DIRECTORY = "exported_data/";
var GAZE_DATA_PREFIX = "gaze_data_";
var RAW_GAZE_DATA_DIRECTORY = "raw_gaze_data/";

exports.save_to_csv = async function(p) {
    if (!fs.existsSync(DATA_DIRECTORY)){
      fs.mkdirSync(DATA_DIRECTORY);
    }
    var header = "";
    var globalVariables = "";
    var file_name = "";
    for (let i = 0; i < p.globalVariables.length; i++) {
      header += p.globalVariables[i].label + ",";
      globalVariables += p.globalVariables[i].value + ",";
      file_name += p.globalVariables[i].label + '_' + p.globalVariables[i].value + '_';
    }

    //prepare the header
    header += "familyTree,task,startTimestamp,firstResponseTimestamp,timeToFirstAnswer,timeToCompletion,correctlyAnswered,comments";

    if (file_name === "") {
      file_name = "Anonymous";
    }

    var gazeDataFile = RAW_GAZE_DATA_DIRECTORY + GAZE_DATA_PREFIX + p._id;
    var newGazeDataFile = DATA_DIRECTORY + GAZE_DATA_PREFIX + file_name + ".csv";

    if (fs.existsSync(gazeDataFile)) {
      if (!fs.existsSync(newGazeDataFile)) {
        fs.rename(gazeDataFile, newGazeDataFile, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
      }
    }

    file_name += ".csv";

    if (fs.existsSync(DATA_DIRECTORY + file_name)) {
      fs.unlinkSync(DATA_DIRECTORY + file_name);
    }

    var logger = fs.createWriteStream(DATA_DIRECTORY + file_name, {
      flags: 'a' // 'a' means appending (old data will be preserved)
    });
    logger.write(header + os.EOL);

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

      let text = globalVariables + line.tasksFamilyTree.join('_') + ',' +
                                   line.taskContent + ',' +
                                   line.displayType + ',' +
                                   line.startTimestamp + ',' +
                                   line.firstResponseTimestamp + ',' +
                                   line.timeToFirstAnswer + ',' +
                                   line.timeToCompletion + ',' +
                                   line.correctlyAnswered + ',' +
                                   commentText + os.EOL;
      logger.write(text);
    });

    logger.end();
  }

exports.save_gaze_data = function (participantId, task, gazeData) {
  if (!fs.existsSync(RAW_GAZE_DATA_DIRECTORY)){
    fs.mkdirSync(RAW_GAZE_DATA_DIRECTORY);
  }
  var file_name = RAW_GAZE_DATA_DIRECTORY + GAZE_DATA_PREFIX + participantId;
  var logger = fs.createWriteStream(file_name, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });

  if (!fs.existsSync(file_name)) {
    var header = "timestamp,X,Y,leftPupilRadius,rightPupilRadius,task,target";
    logger.write(header + os.EOL);
  }

  gazeData.map((row, index) => {
    logger.write(row.timestamp + ',' +
                 row.locX + ',' +
                 row.locY + ',' +
                 row.leftPupilRadius + ',' +
                 row.rightPupilRadius + ',' +
                 task + ',' +
                 row.target + ',' + os.EOL);
  })
  logger.end();
}
