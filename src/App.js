import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createBrowserHistory } from "history";

import MediaQuery from "containers/MediaQuery";
import Loading from "containers/Loading";

import Routes from "./routes";
import store from "./redux/store";

import config from "config";
import "./app.css";
import ScrollToTop from "utils/ScrollToTop";

const history = createBrowserHistory({ basename: config.BASE_URL });

function App() {
  return (
    <Router history={history}>
      <ScrollToTop />
      <Provider store={store}>
        <Routes />
        <MediaQuery />
        <Loading />
      </Provider>
    </Router>
  );
}

export default App;
