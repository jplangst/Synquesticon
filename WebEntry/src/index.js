import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import store from './core/store';
import 'babel-polyfill'; //for Object.entries that is not supported in Safari

import App from './App';

var doubleTouchStartTimestamp = 0;
document.addEventListener("touchstart", function(event){
    var now = +(new Date());
    if (doubleTouchStartTimestamp + 500 > now){
        event.preventDefault();
    };
    doubleTouchStartTimestamp = now;
});

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>, document.getElementById('root'));
