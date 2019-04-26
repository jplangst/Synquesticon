try {
   // for Node.js
   var autobahn = require('autobahn');
} catch (e) {
   // for browsers (where AutobahnJS is available globally)
}

//var dat = [dat0, dat1, dat2];
var connection = null;
var glob_session = null;
var WebEntryTopic = "Synopticon.WebEntry";

function startWAMP(config) {
  if(connection) {
    try {
      connection.close();
    }
    catch (err) {
      console.log("error when close connection", err);
    }

  }
  connection = new autobahn.Connection({url: 'ws://'+config.ip+':'+config.port+'/ws', realm: config.realm});
  connection.onopen = function (session) {

     // 1) subscribe to a topic
     //function onevent(args) {
    //    console.log("Event:", args[0]);
    // }
     // 2) publish an event
     glob_session = session;
     console.log("connected to router");
  };
  connection.open();
}

//startWAMP(globConfig);

//var popupRect = [0, 0, 0, 0];



module.exports = {
  changeImageAndAOIs: function (image, aois) {

  },
  startStopTask(task) {
    if(glob_session) {
      /*
      int32 ClientID
      int32 QuestionID
      int32 EventCode
      FString Content
      TArray<FString> AOIs
      */
      console.log("publish task", task.question, task.aois);
      glob_session.publish(WebEntryTopic, [-1, -1, -1, task.question, task.aois]);
    }
  },
  restartWAMP(config) {
    startWAMP(config);
  }
};
