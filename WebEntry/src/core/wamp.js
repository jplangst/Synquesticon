var store = require('./store');

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
var RemoteEyeTrackingTopic = "RETDataSample";

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

     function onRETData(args) {
        let gazeRadius = store.default.getState().gazeCursorRadius;

        let gazeData = args[1];
        let gazeX = 0;
        let gazeY = 0;

        //Both eyes valid
        if(!(gazeData[0] < Number.EPSILON) && !(gazeData[3] < Number.EPSILON)){
          gazeX = (gazeData[1] + gazeData[4])/2;
          gazeY = (gazeData[2] + gazeData[5])/2;
        }
        //Left eye validity
        else if(!(gazeData[0] < Number.EPSILON)){
          gazeX = gazeData[1];
          gazeY = gazeData[2];
        }
        //Right eye validity
        else if(!(gazeData[3] < Number.EPSILON)){
          gazeX = gazeData[4];
          gazeY = gazeData[5];
        }
        else{
          return;
        }

        let gazeAction = {
          type: 'SET_GAZE_DATA',
          gazeData: {
            locX: gazeX,
            locY: gazeY
          }
        }
        store.default.dispatch(gazeAction);
      }
    session.subscribe('RETDataSample', onRETData);
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
