import SceneView from '@arcgis/core/views/SceneView';
import { useEffect, useRef } from 'react';

import * as styles from './Scene.module.css';
import { useScene } from './SceneProvider';

interface SceneProps {
  view?: __esri.SceneViewProperties;
}

export function Scene(props: SceneProps) {
  const viewDiv = useRef(null);

  const { state, dispatch } = useScene();

  useEffect(() => {
    const view = new SceneView({
      container: viewDiv.current!,
      map: state.map,
      ...props.view
    });
    dispatch({ type: 'INITIALIZE', view });

    return () => {
      view.destroy();
      dispatch({ type: 'DESTROY' });
    };
  }, []);

  return <div className={styles.viewDiv} ref={viewDiv}></div>;
}

export default Scene;
