import * as styles from './App.module.css';

import { useEffect, useRef } from 'react';
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

import "@esri/calcite-components/dist/components/calcite-card";
import {
  CalciteCard
} from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/calcite/calcite.css";

export function App() {

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {

      const webmap = new WebMap({
        portalItem: {
          id: "aa1d3f80270146208328cf66d022e09c"
        }
      });

      new MapView({
        container: mapDiv.current,
        map: webmap
      });

    }
  }, []);

  return (
    <>
      <div className={styles.mapDiv} ref={mapDiv}></div>
      <CalciteCard className={styles.card}>
        <img
          alt="footer thumbnail"
          slot="thumbnail"
          src="./assets/image.jpg"
        />
        <h3 slot="title">A beautiful hiking day</h3>
        <span slot="subtitle">Seealpsee region, Switzerland</span>
        <span slot="footer-leading">June 20, 2021</span>
      </CalciteCard>
    </>
  );
}

export default App;