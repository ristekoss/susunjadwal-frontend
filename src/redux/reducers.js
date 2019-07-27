import { combineReducers } from "redux";

import auth from "./modules/auth";
import appState from "./modules/appState";
import schedules from "./modules/schedules";
import courses from "./modules/courses";

const rootReducer = combineReducers({
  auth,
  appState,
  schedules,
  courses
});

export default rootReducer;
