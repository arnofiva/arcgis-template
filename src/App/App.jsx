import * as styles from './App.module.css';

import { useEffect, useRef } from 'react';
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

export function App() {

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {

      const webmap = new WebMap({
        portalItem: {
          id: "aa1d3f80270146208328cf66d022e09c"
        }
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap
      });

    }
  }, []);

  return (<div className={styles.mapDiv} ref={mapDiv}></div>);
}

export default App;