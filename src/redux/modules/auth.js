import { loadAuth } from "utils/auth";
export const SET_AUTH = "SET_AUTH";

export default function reducer(state = loadAuth(), { type, payload }) {
  switch (type) {
    case SET_AUTH:
      return payload;
    default:
      return state;
  }
}

export function setAuth(auth) {
  return {
    type: SET_AUTH,
    payload: auth
  };
}
