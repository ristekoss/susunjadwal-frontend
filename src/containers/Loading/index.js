import React from "react";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";

import "./styles.css";

function Loading() {
  const loading = useSelector((state) => state.appState.loading);
  const theme = useColorModeValue("light", "dark");

  return (
    <div
      className="loadingScreen"
      style={{
        display: loading ? "block" : "none",
        background: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#333333" : "#FFFFFFCC",
      }}
    >
      <div className="container">
        <div className="centralizer text-center">
          <div
            className="sk-folding-cube"
            style={{
              "--cube-color-var": theme === "light" ? "#5038BC" : "#674DE0",
            }}
          >
            <div className="sk-cube1 sk-cube" />
            <div className="sk-cube2 sk-cube" />
            <div className="sk-cube4 sk-cube" />
            <div className="sk-cube3 sk-cube" />
          </div>
          <h1>Loading, building up your request...</h1>
        </div>
      </div>
    </div>
  );
}

export default Loading;
