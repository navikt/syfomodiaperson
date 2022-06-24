import { combineReducers } from "redux";
import navbruker, { NavbrukerState } from "./navbruker/navbruker";

export interface RootState {
  navbruker: NavbrukerState;
}

export const rootReducer = combineReducers<RootState>({
  navbruker,
});
