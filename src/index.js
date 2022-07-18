import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "styles/ChakraConf";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>,
  document.getElementById("root"),
);
