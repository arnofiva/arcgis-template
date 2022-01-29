import { createContext, useContext, useReducer } from 'react';

import SceneView from '@arcgis/core/views/SceneView';
import Map from '@arcgis/core/Map';

export interface SceneProviderProps {
  map?: Map | __esri.MapProperties;
}

export interface ISceneContext {
  view: SceneView | null;
  map: Map | __esri.MapProperties;
}

const defaultContext: ISceneContext = {
  view: null,
  map: {
    basemap: 'satellite',
    ground: 'world-elevation'
  }
};

export type Action = { type: 'INITIALIZE'; view: SceneView } | { type: 'DESTROY' };

type Dispatch = (action: Action) => void;

const reducer = (state: ISceneContext, action: Action): ISceneContext => {
  switch (action.type) {
    case 'INITIALIZE':
      const view = action.view;
      return { ...state, view, map: view.map };
    case 'DESTROY':
      const map = state.view?.map;
      if (map) {
        map.destroy();
      }
      return { ...state, view: null };
    default:
      throw new Error('Invalid action');
  }
};

export const SceneContext = createContext<{ state: ISceneContext; dispatch: Dispatch } | undefined>(
  //   {
  //   state: defaultContext,
  //   dispatch: () => {}
  // }
  undefined
);

export const SceneProvider: React.FC<SceneProviderProps> = (props) => {
  const map = props.map || defaultContext.map;

  debugger;
  const [state, dispatch] = useReducer(reducer, { ...defaultContext, map });
  const value = { state, dispatch };
  return <SceneContext.Provider value={value}>{props.children}</SceneContext.Provider>;
};

export function useScene() {
  debugger;

  const ctx = useContext(SceneContext);
  if (ctx === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return ctx;
}
