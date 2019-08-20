const fs = require('fs');
const os = require("os");
var exports = module.exports = {};

exports.save_to_csv = function(p) {
    var header = "";
    var globalVariables = "";
    var file_name = "";
    for (let i = 0; i < p.globalVariables.length; i++) {
      header += p.globalVariables[i].label + ",";
      globalVariables += p.globalVariables[i].value + ",";
      file_name += p.globalVariables[i].label + '_' + p.globalVariables[i].value + '_';
    }

    //prepare the header
    header += "familyTree, startTimestamp, firstResponseTimestamp, timeToFirstAnswer, timeToCompletion, correctlyAnswered";

    if (file_name === "") {
      file_name = "Unnamed";
    }
    file_name += ".csv";

    if (fs.existsSync(file_name)) {
      fs.unlinkSync(file_name);
    }

    var logger = fs.createWriteStream(file_name, {
      flags: 'a' // 'a' means appending (old data will be preserved)
    });
    logger.write(header + os.EOL);

    p.linesOfData.map((line, index) => {
      let text = globalVariables + line.tasksFamilyTree.join('_') + ',' +
                                   line.startTimestamp + ',' +
                                   line.firstResponseTimestamp + ',' +
                                   line.timeToFirstAnswer + ',' +
                                   line.timeToCompletion + ',' +
                                   line.correctlyAnswered + os.EOL;
      logger.write(text);
    });

    logger.end();
  }
