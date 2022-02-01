import * as styles from './App.module.css';

import { useEffect, useRef } from 'react';

import '@esri/calcite-components/dist/components/calcite-card';
import Scene from '../Scene/Scene';
import { useScene } from '../Scene/SceneProvider';
import OverlayGlobe from '../OverlayGlobe/OverlayGlobe';
import Slides from '../Slides/Slides';
import { useAppState } from './AppState';

console.log('Start App');

export function App() {
  const { state: scene } = useScene();
  const globeDiv = useRef(null);
  useEffect(() => {
    const view = scene.view;
    if (view) {
      view.ui.add(globeDiv.current!, 'bottom-right');
    }
  }, [scene]);

  const { state: appState } = useAppState();
  useEffect(() => {
    if (appState.slide && scene.view) {
      appState.slide.applyTo(scene.view);
    }
  }, [appState]);

  return (
    <>
      <div className={styles.app}>
        <div className={styles.slides}>
          <Slides></Slides>
        </div>
        <div className={styles.scene}>
          <Scene></Scene>
          <div ref={globeDiv} className={styles.globeDiv}>
            <OverlayGlobe></OverlayGlobe>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
