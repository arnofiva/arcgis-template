import * as style from './Slides.module.css';

import { useEffect, useState } from 'react';

import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-panel';
import '@esri/calcite-components/dist/components/calcite-pick-list';
import '@esri/calcite-components/dist/components/calcite-pick-list-item';
import { CalciteButton, CalcitePanel, CalcitePickList, CalcitePickListItem } from '@esri/calcite-components-react';

import { useScene } from '../Scene/SceneProvider';
import WebScene from '@arcgis/core/WebScene';
import Slide from '@arcgis/core/webscene/Slide';
import { useAppState } from '../App/AppState';

export function Slides() {
  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([] as Slide[]);
  const { state: scene } = useScene();
  const { state: appState, dispatch } = useAppState();

  useEffect(() => {
    const view = scene.view;
    if (view && view.map && (view.map as WebScene).presentation) {
      const map = view.map as WebScene;
      map.loadAll().then(() => {
        setTitle(map.portalItem.title);
        setSlides(map.presentation.slides.toArray());
      });
    }
  }, [scene]);

  const onListItemChange = (
    itemEvent: CustomEvent<{
      item: HTMLCalcitePickListItemElement;
      value: Slide;
      selected: boolean;
      shiftPressed: boolean;
    }>
  ) => {
    const detail = itemEvent.detail;
    if (detail.selected) {
      dispatch({ type: 'SELECT_SLIDE', slide: detail.value });
    }
  };

  const slideItems = slides.map((slide, index) => (
    <CalcitePickListItem
      key={index}
      label={slide.title.text}
      onCalciteListItemChange={onListItemChange}
      description={slide.description.text}
      value={slide}
    >
      {/* <CalciteAction slot='actions-end' icon='layer'></CalciteAction> */}
    </CalcitePickListItem>
  ));

  return (
    <>
      <CalcitePanel heading={title} className={style.panel}>
        <CalcitePickList>{slideItems}</CalcitePickList>
        <CalciteButton width='half' slot='footer-actions' appearance='outline'>
          Previous
        </CalciteButton>
        <CalciteButton width='half' slot='footer-actions'>
          Next
        </CalciteButton>
      </CalcitePanel>
    </>
  );
}

export default Slides;
