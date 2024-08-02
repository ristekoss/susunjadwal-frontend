import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createBrowserHistory } from "history";

import { AdsProvider } from "@ristek-kit/ads";
import MediaQuery from "containers/MediaQuery";
import Loading from "containers/Loading";

import Routes from "./routes";
import store from "./redux/store";

import config from "config";
import "./app.css";
import "@ristek-kit/ads/dist/styles.css";
import ScrollToTop from "utils/scroll";

const history = createBrowserHistory({ basename: config.BASE_URL });

function App() {
  return (
    <Router history={history}>
      <ScrollToTop />
      <Provider store={store}>
        <AdsProvider platform="SusunJadwal" theme="light">
          <Routes />
        </AdsProvider>
        <MediaQuery />
        <Loading />
      </Provider>
    </Router>
  );
}

export default App;
