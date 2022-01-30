import SceneView from '@arcgis/core/views/SceneView';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D';
import TextSymbol3DLayer from '@arcgis/core/symbols/TextSymbol3DLayer';
import IconSymbol3DLayer from '@arcgis/core/symbols/IconSymbol3DLayer';
import * as promiseUtils from '@arcgis/core/core/promiseUtils';

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

  const goTo = async (target: Point) => {
    const globeView = globeScene.view;
    if (globeView) {
      try {
        await globeView.goTo({
          target,
          heading: 0
        });
      } catch {
        /* Ignore concurrent calls to goTo */
      }
      return globeView;
    }
    throw new Error();
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
    const slide = appState.slide;
    if (slide) {
      (async () => {
        const point = slide.viewpoint.camera.position;

        const globeView = await goTo(point);
        globeView.graphics.removeAll();
        globeView.graphics.add(
          new Graphic({
            geometry: point,
            symbol: new PointSymbol3D({
              symbolLayers: [
                new IconSymbol3DLayer({
                  resource: {
                    primitive: 'circle'
                  },
                  material: {
                    color: 'black'
                  },
                  size: '4px'
                }),
                new TextSymbol3DLayer({
                  text: `${slide.title.text}\n `,

                  material: {
                    color: 'black'
                  },
                  size: 6
                })
              ]
            })
          })
        );
      })();
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
