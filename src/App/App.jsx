import * as styles from './App.module.css';

import { useEffect, useRef } from 'react';
import SceneView from "@arcgis/core/views/SceneView";
import WebScene from "@arcgis/core/WebScene";

import "@esri/calcite-components/dist/components/calcite-card";
import {
  CalciteCard
} from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/calcite/calcite.css";

export function App() {

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {

      const webscene = new WebScene({
        portalItem: {
          id: "1616213768fd4418905da6b1f3af9591"
        }
      });

      new SceneView({
        container: mapDiv.current,
        map: webscene
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