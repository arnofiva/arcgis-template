import SceneView from '@arcgis/core/views/SceneView';
import Point from '@arcgis/core/geometry/Point';
import { useEffect, useRef } from 'react';

import * as style from './OverlayGlobe.module.css';
import SceneProvider, { useScene } from '../Scene/SceneProvider';
import Scene from '../Scene/Scene';
import { useAppState } from '../App/AppState';

const globeProps: __esri.SceneViewProperties = {
  ui: { components: [] },
  alphaCompositingEnabled: true,
  environment: {
    background: {
      type: 'color',
      color: [0, 0, 0, 0]
    },
    lighting: {
      date: new Date('null')
    },
    starsEnabled: false,
    atmosphereEnabled: false
  },
  // zoom: 1.5,
  constraints: {
    altitude: {
      min: 17000000,
      max: 17000000
    }
  }
};

function Globe(props: { view: SceneView }) {
  const { state: globeScene } = useScene();

  const goTo = (target: Point) => {
    const globeView = globeScene.view;
    if (globeView) {
      globeView.goTo({
        target,
        heading: 0
      });
    }
  };

  useEffect(() => {
    const view = props.view;
    if (view) {
      const handle = view.watch(['interacting', 'stationary'], () => {
        if (view.stationary && !view.interacting) {
          goTo(view.center);
        }
      });
      return () => {
        handle.remove();
      };
    }
  }, [props]);

  const { state: appState } = useAppState();
  useEffect(() => {
    if (appState.slide) {
      goTo(appState.slide.viewpoint.camera.position);
    }
  }, [appState]);

  return (
    <>
      <Scene view={globeProps}></Scene>
    </>
  );
}

export function OverlayGlobe() {
  const viewDiv = useRef(null);

  const { state } = useScene();

  return (
    <div className={style.overlayGlobe}>
      <SceneProvider map={{ basemap: 'gray-vector' }}>
        <Globe view={state.view!}></Globe>
      </SceneProvider>
    </div>
  );
}

export default OverlayGlobe;
