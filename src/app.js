import Chart from 'chart.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import App from './components/App';
import ancestryApp from './reducers'

const data = {
	labels: [],
	datasets: [],
  threshold: 51
};

const store = createStore(ancestryApp, data, compose(applyMiddleware(thunk),
 window.devToolsExtension ? window.devToolsExtension() : f => f));

init();
store.subscribe(init);

function init() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('chart-test'));
}
