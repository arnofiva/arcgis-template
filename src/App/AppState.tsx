import { createContext, useContext, useReducer } from 'react';

import Slide from '@arcgis/core/webscene/Slide';

interface AppState {
  slide?: Slide | null;
}

const defaultState: AppState = {};

type Action = { type: 'SELECT_SLIDE'; slide: Slide };

type Dispatch = (action: Action) => void;

const AppState = createContext<{ state: AppState; dispatch: Dispatch } | undefined>(undefined);

const mainReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SELECT_SLIDE':
      return { ...state, slide: action.slide };
    default:
      throw new Error('Invalid action');
  }
};

const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, defaultState);
  return <AppState.Provider value={{ state, dispatch }}>{children}</AppState.Provider>;
};

function useAppState() {
  const ctx = useContext(AppState);
  if (ctx === undefined) {
    throw new Error('useAppState must be used within a AppStateProvider');
  }
  return ctx;
}

export default AppStateProvider;
export { AppState, useAppState };