import { createContext, useContext, useReducer } from 'react';

import Slide from '@arcgis/core/webscene/Slide';

export interface AppState {
  name: string;
  webScene: __esri.WebSceneProperties;
  slide?: Slide | null;
}

const defaultState: AppState = {
  name: '',
  webScene: {
    portalItem: {
      id: '91b46c2b162c48dba264b2190e1dbcff'
    }
  }
};

export type Action = { type: 'SELECT_SLIDE'; slide: Slide } | { type: 'DESELECT_SLIDE' };

const AppState = createContext<{ state: AppState; dispatch: React.Dispatch<any> }>({
  state: defaultState,
  dispatch: () => null
});

const mainReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SELECT_SLIDE':
      return { ...state, slide: action.slide };
    case 'DESELECT_SLIDE':
      return { ...state, slide: null };
    default:
      throw new Error('Invalid action');
  }
};

const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, defaultState);
  return <AppState.Provider value={{ state, dispatch }}>{children}</AppState.Provider>;
};

const useAppState = () => useContext(AppState);

export default AppState;
export { AppStateProvider, useAppState };
