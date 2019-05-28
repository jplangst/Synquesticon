const EventEmitter = require('events');

const NEW_MESSAGE_EVENT = "WAMPEvent";
const NEW_PARTICIPANT_EVENT = "ParticipantEvent";

class CWampStore extends EventEmitter {
  constructor() {
	  super();
		this.currentMessage = [];
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

	getCurrentMessage(){
		return this.currentMessage;
	}
	setCurrentMessage(args){
		this.currentMessage = args;
	}
}

let WampStore = new CWampStore();
export default WampStore;
