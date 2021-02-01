import * as moment from 'moment';
import 'moment/min/locales';
import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContainer from './AppContainer';
import './i18n';
import * as serviceWorker from './serviceWorker';

const locale = window.navigator.language;

// Use the 'moment' instance from 'moment/min/moment-with-locales' instead of the
// default instance. Set the language to Portuguese.
Moment.globalMoment = moment.default;

// Set the output timezone for local for every instance.
Moment.globalLocale = locale;
moment.locale(locale);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }

  interface ShareData {
    text?: string;
    title?: string;
    url?: string;
  }
  interface Navigator {
    share: (data?: ShareData) => Promise<void>;
  }
}

if (process.env.NODE_ENV === 'development') {
  // This adds a button to the widget container to easily open the Redux DevTools
  if (typeof window.parent.__REDUX_DEVTOOLS_EXTENSION__ === 'function' && !window.parent.document.getElementById('redux-tools') && window.parent.document.getElementsByClassName('mx_AppsContainer').length) {
    const reduxToolsButton = document.createElement('a');
    reduxToolsButton.id = 'redux-tools';
    reduxToolsButton.setAttribute('href', '#redux-tools');
    reduxToolsButton.setAttribute('style', 'position: absolute; top: 10px; right: 50px; font-size: 0.7em; font-weight: bold;');
    reduxToolsButton.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      window.parent.__REDUX_DEVTOOLS_EXTENSION__.open('right');
    };
    const label = document.createTextNode('[Redux DevTools]');
    reduxToolsButton.appendChild(label);
    window.parent.document.getElementsByClassName('mx_AppsContainer')[0].appendChild(reduxToolsButton);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppContainer />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
