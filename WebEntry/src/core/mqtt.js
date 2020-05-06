var store = require('./store');
var eventStore = require('./eventStore');
var playerUtils = require('./player_utility_functions');

//MQTT javascript library
var mqtt = require('mqtt')

//Connection settings
var mqttClient = null;
var last_config = null;

//Publication topics
var SynquesticonTopic = "Synquesticon.Task";
var SynquesticonCommandTopic = "Synquesticon.Command";
var SynquesticonMultipleScreenTopic = "Synquesticon.MultipleScreen";
var RemoteEyeTrackingTopic = "RETDataSample";

function onCommandEvent(message) {
  eventStore.default.setCurrentCommand(message);
  eventStore.default.emitNewCommand();
}

function onMQTTEvent(message) {
  if(message){
    eventStore.default.setCurrentMessage(message);
    eventStore.default.emitMQTTEvent();
  }
}

function onMultipleScreenEvent(message) {
  if(message){
    let parsedMessage = JSON.parse(message);

    //Only respond to the message if the device ID matches our own
    if(parsedMessage.deviceID === window.localStorage.getItem('deviceID') && parsedMessage.screenID !== store.default.getState().screenID){
      eventStore.default.emitMultipleScreenEvent(JSON.parse(message));
    }
  }
}

//TODO test and finish
function onRETData(newMessage) {

   let message = JSON.parse(newMessage);
   let gazeData = message[1];
   let gazeX = gazeData[12];
   let gazeY = gazeData[13];

   let gazeAction = {
     type: 'SET_GAZE_DATA',
     tracker: message[0],
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

function _startMQTT(config, restart) {
  if(restart){
    console.log("restarting mqtt client");
    mqttClient.end();
  }
  else if (last_config && (last_config.ip === config.ip && last_config.port === config.port))
  {
    return;
  }

  var wsURL = "ws://";
  if(config.ip.includes("/crossbarproxy")){ //TODO check if needed after pushing to the server. If so rename to /mqttProxy
    wsURL = "wss://";
  }
  wsURL += config.ip + ":" + config.port;

  //Attempt to connect the client to the mqtt broker
  console.log("Attmpting to connect to the mqtt broker ", wsURL);
  mqttClient  = mqtt.connect(wsURL);
  last_config = config;

  //When the client connects we subscribe to the topics we want to listen to
  mqttClient.on('connect', function () {
    console.log("Connected to mqtt broker");
    mqttClient.subscribe(SynquesticonTopic, function (err) {
      if (err) {
        console.log(err);
      }
    });
    mqttClient.subscribe(SynquesticonCommandTopic, function (err) {
      if (err) {
        console.log(err);
      }
    });
    mqttClient.subscribe(SynquesticonMultipleScreenTopic, function (err) {
      if (err) {
        console.log(err);
      }
    });
    mqttClient.subscribe(RemoteEyeTrackingTopic, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  //When the client connects we subscribe to the topics we want to listen to
  mqttClient.on('message', function (topic, message) {
    if(topic === SynquesticonTopic){
      onMQTTEvent(message);
    }
    else if(topic === SynquesticonCommandTopic){
      onCommandEvent(message);
    }
    else if(topic === RemoteEyeTrackingTopic){
      onRETData(message);
    }
    else if(topic === SynquesticonMultipleScreenTopic){
      onMultipleScreenEvent(message);
    }
    else{
      console.log("message from unknown topic recieved: ", topic);
    }
  });
}

module.exports = {
  broadcastEvents(info) {
    if(mqttClient){
      mqttClient.publish(SynquesticonTopic, info);
    }
    else{
      console.log("Tried to publish, but MQTT client was null")
    }
  },
  broadcastCommands(command) {
    if(mqttClient){
      mqttClient.publish(SynquesticonCommandTopic, command);
    }
    else{
      console.log("Tried to publish, but MQTT client was null")
    }
  },
  broadcastMultipleScreen(command) {
    if(mqttClient){
      mqttClient.publish(SynquesticonMultipleScreenTopic, command);
    }
    else{
      console.log("Tried to publish, but MQTT client was null")
    }
  },
  startMQTT(config, restart){
    _startMQTT(config, restart);
  }
};
