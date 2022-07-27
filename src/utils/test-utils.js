// https://javascript.plainenglish.io/setting-up-jest-with-react-testing-library-to-work-with-redux-components-ee672ec12050

import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
// Import our reducer
import reducer from "../redux/reducers"; // to access rest of reducers
//custom render that includes redux provider
const render = (
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
