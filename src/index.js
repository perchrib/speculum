import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import './index.css';
//import {OtherMain, BasicLayout} from './Main';
//import MyResponsiveGrid from './Responsive'
//import GridPropertyLayout from './Test'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
