import { createContext, useContext, useReducer } from 'react';

import SceneView from '@arcgis/core/views/SceneView';
import Map from '@arcgis/core/Map';
import WebScene from '@arcgis/core/WebScene';
import WebMap from '@arcgis/core/WebMap';

interface SceneProviderProps {
  map?: Map | __esri.MapProperties;
}

type BaseContextState = {
  view?: SceneView | null;
};

type MapContextState = BaseContextState & {
  type: 'esri.Map';
  map: Map;
};

type WebSceneContextState = BaseContextState & {
  type: 'esri.WebScene';
  map: WebScene;
};

type WebMapContextState = BaseContextState & {
  type: 'esri.WebMap';
  map: WebMap;
};

type ContextState = MapContextState | WebSceneContextState | WebMapContextState;

type Action = { type: 'INITIALIZE'; view: SceneView } | { type: 'DESTROY' };

type Dispatch = (action: Action) => void;

type SceneContext = {
  state: ContextState;
  dispatch: Dispatch;
};

type TypedSceneContext<G extends Map> = {
  state: {
    view?: SceneView;
    map: G;
  };
  dispatch: Dispatch;
};

const reducer = (state: ContextState, action: Action): ContextState => {
  switch (action.type) {
    case 'INITIALIZE':
      const view = action.view;
      return { ...state, view };
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

const SceneContext = createContext<SceneContext | undefined>(undefined);

const defaultProps: SceneProviderProps = {
  map: {
    basemap: 'satellite',
    ground: 'world-elevation'
  }
};

const createInitialContext = (props: SceneProviderProps): ContextState => {
  const map = props.map;

  if (map instanceof WebScene && map.declaredClass === 'esri.WebScene') {
    return {
      type: map.declaredClass,
      map: map
    };
  } else if (map instanceof WebMap && map.declaredClass === 'esri.WebMap') {
    return {
      type: map.declaredClass,
      map: map
    };
  } else if (map instanceof Map && map.declaredClass === 'esri.Map') {
    return {
      type: map.declaredClass,
      map: map
    };
  } else {
    return {
      type: 'esri.Map',
      map: new Map({
        basemap: 'satellite',
        ground: 'world-elevation',
        ...map
      })
    };
  }
};

const SceneProvider: React.FC<SceneProviderProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, createInitialContext(props));
  const value = { state, dispatch };
  return <SceneContext.Provider value={value}>{props.children}</SceneContext.Provider>;
};

function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}

function useWebScene() {
  const scene = useScene();
  const { state } = scene;
  if (state.type !== 'esri.WebScene') {
    throw new Error('useScene must be used within a SceneProvider with map being a WebScene');
  }

  return scene as TypedSceneContext<WebScene>;
}

function useWebMap() {
  const scene = useScene();
  const { state } = scene;
  if (state.type !== 'esri.WebMap') {
    throw new Error('useScene must be used within a SceneProvider with map being a WebScene');
  }

  return scene as TypedSceneContext<WebScene>;
}

export default SceneProvider;
export { SceneContext, useScene, useWebScene, useWebMap };
