import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import AppStateProvider from './App/AppState';
import './global.css';

import '@esri/calcite-components/dist/calcite/calcite.css';
import WebScene from '@arcgis/core/WebScene';
import SceneProvider from './Scene/SceneProvider';

const webScene = new WebScene({
  portalItem: {
    id: '91b46c2b162c48dba264b2190e1dbcff'
  }
});

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
      <SceneProvider map={webScene}>{<App />}</SceneProvider>
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
