/**
 * optimize course isSelected lookup
 */

export const ADD_SCHEDULE = "ADD_SCHEDULE";
export const REMOVE_SCHEDULE = "REMOVE_SCHEDULE";
export const CLEAR_SCHEDULE = "CLEAR_SCHEDULE";
export const SET_COURSES = "SET_COURSES";

export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case SET_COURSES:
      const result = {};
      payload.forEach(course => {
        course.classes.forEach(class_ => {
          const key = `${course.name}-${class_.name}`;
          result[key] = !!state[key];
        });
      });
      return result;

    case ADD_SCHEDULE:
    case REMOVE_SCHEDULE:
      const nextState = { ...state };
      const activatedKey = `${payload.parentName}-${payload.name}`;
      Object.keys(state).forEach(key => {
        if (key.indexOf(payload.parentName) === 0) {
          nextState[key] = type !== REMOVE_SCHEDULE && key === activatedKey;
        }
      });
      return nextState;
    case CLEAR_SCHEDULE:
      return {};
    default:
      return state;
  }
}

export function setCourses(courses) {
  return { type: SET_COURSES, payload: courses };
}
