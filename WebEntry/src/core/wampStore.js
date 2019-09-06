const EventEmitter = require('events');

const NEW_MESSAGE_EVENT = "WAMPEvent";
const NEW_PARTICIPANT_EVENT = "ParticipantEvent";
const NEW_REMOTE_TRACKER_EVENT = "NewRemoteTrackerEvent";
const NEW_COMMAND_EVENT = "NewCommandEvent";

class CWampStore extends EventEmitter {
  constructor() {
	  super();
		this.currentMessage = [];
    this.currentCommand = [];
    this.currentRemoteTracker = null;
    this.receivedRemoteTrackers = [];
  }

	addEventListener(callback) {
		this.addListener(NEW_MESSAGE_EVENT, callback);
	}
	removeEventListener(callback) {
		this.removeListener(NEW_MESSAGE_EVENT, callback);
	}
	emitNewWAMPEvent() {
		this.emit(NEW_MESSAGE_EVENT);
	}

  addNewParticipantListener(callback) {
    this.addListener(NEW_PARTICIPANT_EVENT, callback);
  }
  removeNewParticipantListener(callback) {
    this.removeListener(NEW_PARTICIPANT_EVENT, callback);
  }
  emitNewParticipant() {
    this.emit(NEW_PARTICIPANT_EVENT);
  }

  addNewCommandListener(callback) {
    this.addListener(NEW_COMMAND_EVENT, callback);
  }
  removeNewCommandListener(callback) {
    this.removeListener(NEW_COMMAND_EVENT, callback);
  }
  emitNewCommand() {
    this.emit(NEW_COMMAND_EVENT);
  }

  addNewRemoteTrackerListener(callback) {
    this.addListener(NEW_REMOTE_TRACKER_EVENT, callback);
  }

  removeNewRemoteTrackerListener(callback) {
    this.removeListener(NEW_REMOTE_TRACKER_EVENT, callback);
  }

  emitNewRemoteTrackerListener() {
    if (!this.receivedRemoteTrackers.includes(this.currentRemoteTracker)) {
      this.emit(NEW_REMOTE_TRACKER_EVENT);
    }
  }

	getCurrentMessage(){
		return this.currentMessage;
	}
	setCurrentMessage(args){
		this.currentMessage = args;
	}

  getCurrentCommand(){
    return this.currentCommand;
  }
  setCurrentCommand(args){
    this.currentCommand = args;
  }

  getCurrentRemoteTracker(){
    return this.currentRemoteTracker;
  }
  setCurrentRemoteTracker(tracker){
    this.currentRemoteTracker = tracker;
  }
  confirmRecevingRemoteTracker() {
    this.receivedRemoteTrackers.push(this.currentRemoteTracker);
  }
}

let WampStore = new CWampStore();
export default WampStore;
