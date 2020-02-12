var store = require('./store');
var wampStore = require('./wampStore');
var playerUtils = require('./player_utility_functions');

try {
   // for Node.js
   var autobahn = require('autobahn');
} catch (e) {
   // for browsers (where AutobahnJS is available globally)
}

//var dat = [dat0, dat1, dat2];
var connection = null;
var glob_session = null;
var last_config = null;
var SynquesticonTopic = "Synquesticon.Task";
var SynquesticonCommandTopic = "Synquesticon.Command";
var RemoteEyeTrackingTopic = "RETDataSample";

function _startWAMP(config) {

  if (last_config && (last_config.ip === config.ip &&
                      last_config.port === config.port &&
                      last_config.realm === config.realm)) {
    return;
  }

  var wsString = 'wss://';

  var configString = "";
  if(config.ip !== ""){
    configString += config.ip;
  }
  if(config.port !== ""){
    configString += ':' + config.port;
    wsString = 'ws://';
  }
  else{
    configString += '/crossbarproxy'
  }

  connection = new autobahn.Connection({url: wsString+configString+'/ws', realm: config.realm});

  connection.onopen = function (session) {

     // 1) subscribe to a topic
     //function onevent(args) {
    //    console.log("Event:", args[0]);
    // }
     // 2) publish an event
     glob_session = session;
     last_config = config;
     console.log("connected to router");

     function onRETData(args) {
        //let gazeRadius = store.default.getState().gazeCursorRadius;

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
            timestamp: playerUtils.getCurrentTime(),
            locX: gazeX,
            locY: gazeY,
            leftPupilRadius: gazeData[0]/2,
            rightPupilRadius: gazeData[3]/2
          }
        }
        store.default.dispatch(gazeAction);
      }
    session.subscribe(RemoteEyeTrackingTopic, onRETData);

    function onWAMPEvent(args, kwargs, details) {
      wampStore.default.setCurrentMessage(args);
      wampStore.default.emitNewWAMPEvent();
    }
    console.log("subscribe to the wamp events");
    session.subscribe(SynquesticonTopic, onWAMPEvent);

    function onCommandEvent(args) {
      wampStore.default.setCurrentCommand(args);
      wampStore.default.emitNewCommand();
    }
    session.subscribe(SynquesticonCommandTopic, onCommandEvent);
  };
  connection.open();
}

//startWAMP(globConfig);

//var popupRect = [0, 0, 0, 0];



module.exports = {
  changeImageAndAOIs: function (image, aois) {

  },

  broadcastEvents(info) {
    try {
      if(glob_session && info) {
        /*console.log(info);*/
        glob_session.publish(SynquesticonTopic, [info]);
      }
    }
    catch (err) {
      if (last_config) {
        _startWAMP(last_config);
      }
    }
  },
  broadcastCommands(command) {
    try {
      if(glob_session) {
        glob_session.publish(SynquesticonCommandTopic, [command]);
      }
    }
    catch (err) {
      if (last_config) {
        _startWAMP(last_config);
      }
    }
  },
  restartWAMP(config) {
    if(connection) {
      try {
        console.log("WAMP: close connection");
        connection.close();
      }
      catch (err) {
        console.log("error when close connection", err);
      }

    }
    _startWAMP(config);
  },
  startWAMP(config) {
    _startWAMP(config);
  }
};
