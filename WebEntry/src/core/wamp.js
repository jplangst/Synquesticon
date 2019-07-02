var store = require('./store');
var wampStore = require('./wampStore');

try {
   // for Node.js
   var autobahn = require('autobahn');
} catch (e) {
   // for browsers (where AutobahnJS is available globally)
}

//var dat = [dat0, dat1, dat2];
var connection = null;
var glob_session = null;
var SynquesticonTopic = "Synquesticon.Task";
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
        let gazeX = gazeData[12];
        let gazeY = gazeData[13];

        //Both eyes valid
        // if(!(gazeData[0] < Number.EPSILON) && !(gazeData[3] < Number.EPSILON)){
        //   gazeX = (gazeData[1] + gazeData[4])/2;
        //   gazeY = (gazeData[2] + gazeData[5])/2;
        // }
        // //Left eye validity
        // else if(!(gazeData[0] < Number.EPSILON)){
        //   gazeX = gazeData[1];
        //   gazeY = gazeData[2];
        // }
        // //Right eye validity
        // else if(!(gazeData[3] < Number.EPSILON)){
        //   gazeX = gazeData[4];
        //   gazeY = gazeData[5];
        // }
        // else{
        //   return;
        // }

        let gazeAction = {
          type: 'SET_GAZE_DATA',
          tracker: args[0],
          gazeData: {
            locX: gazeX,
            locY: gazeY
          }
        }
        store.default.dispatch(gazeAction);
      }
    session.subscribe(RemoteEyeTrackingTopic, onRETData);

    function onWAMPEvent(args) {
      wampStore.default.setCurrentMessage(args);
      wampStore.default.emitNewWAMPEvent();
    }
    session.subscribe(SynquesticonTopic, onWAMPEvent);
  };
  connection.open();
}

//startWAMP(globConfig);

//var popupRect = [0, 0, 0, 0];



module.exports = {
  changeImageAndAOIs: function (image, aois) {

  },
  broadcastEvents(info) {
    if(glob_session) {
      glob_session.publish(SynquesticonTopic, info);
    }
  },
  restartWAMP(config) {
    startWAMP(config);
  }
};
