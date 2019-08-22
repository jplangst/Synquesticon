import store from './store';
import * as dbObjectsUtilityFunctions from './db_objects_utility_functions';

export function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

export function getFormattedCurrentTime() {
  var dt = new Date();
  var currentTime = dt.toUTCString();
  return currentTime;
}

var myStorage = window.localStorage;
export function getDeviceName() {
  return myStorage.getItem('deviceID');
}
