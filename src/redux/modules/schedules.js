export const ADD_SCHEDULE = "ADD_SCHEDULE";
export const REMOVE_SCHEDULE = "REMOVE_SCHEDULE";
export const CLEAR_SCHEDULE = "CLEAR_SCHEDULE";

function filterSchedule(schedules, { parentName }) {
  return schedules.filter(schedule => schedule.parentName !== parentName);
}

export default function reducer(state = [], { type, payload }) {
  switch (type) {
    case ADD_SCHEDULE:
      return [...filterSchedule(state, payload), payload];
    case REMOVE_SCHEDULE:
      return filterSchedule(state, payload);
    case CLEAR_SCHEDULE:
      return [];
    default:
      return state;
  }
}

export function addSchedule(schedule) {
  return { type: ADD_SCHEDULE, payload: schedule };
}

export function removeSchedule(schedule) {
  return { type: REMOVE_SCHEDULE, payload: schedule };
}

export function clearSchedule() {
  return { type: CLEAR_SCHEDULE };
}
