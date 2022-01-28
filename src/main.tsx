import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components';
import { AppStateProvider } from './AppState';
import './global.css';

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
