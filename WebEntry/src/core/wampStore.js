const EventEmitter = require('events');

const STATE_UPDATE_EVENT = "WAMPEvent";

class CWampStore extends EventEmitter {
  constructor() {
	  super();
		this.currentMessage = [];
  }

	addEventListener(callback) {
		this.addListener(STATE_UPDATE_EVENT, callback);
	}
	removeEventListener(callback) {
		this.removeListener(STATE_UPDATE_EVENT, callback);
	}
	emitNewWAMPEvent() {
		this.emit(STATE_UPDATE_EVENT);
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
