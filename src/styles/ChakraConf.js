// 1. Import the extendTheme function
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import Button from "../components/Button";
import Input from "../components/Input";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const styles = {
  global: (props) => ({
    // styles for the `body`
    body: {
      fontFamily: "Poppins",
      backgroundColor: props.colorMode === "light" ? "#F8F8F8" : "dark.Black",
    },
  }),
};

const breakpoints = createBreakpoints({
  sm: "376px",
  semiMd: "480px",
  md: "768px",
  lg: "900px",
  xl: "1024px",
});

// 2. Extend the theme to include custom colors, fonts, etc
export const colors = {
  primary: {
    Alabaster: "#F8F8F8",
    White: "#FFFFFF",
    DarkPurple: "#917DEC",
    LightPurple: "#674DE0",
    Purple: "#5038BC",
    Malibu: "#64E6FB",
  },
  secondary: {
    Gray: "#828282",
    DarkPurple: "#402D99",
    LightPurple: "#5038BC1A",
    lightGray: "#F5F5F5",
    InputGray: "#F2F2F2",
    Golden: "#FFD668",
    Cerise: "#C424A3",
    MineShaft: "#333333",
  },
  dark: {
    Purple: "#917DEC",
    LightPurple: "#674DE0",
    Black: "#121212",
    LightBlack: "#222222",
    White: "#D0D0D0",
    Red: "#3F1C1B",
  },
  state: {
    Error: "#EB5757",
    DarkError: "#C74040",
    ErrorGhost: "#EB57571A",
    Warning: "#F7B500",
    Success: "#27AE60",
    Info: "#2D9CDB",
  },
};

const theme = extendTheme({
  breakpoints,
  styles,
  colors,
  components: { Button, Input },
  initialColorMode: "light",
  useSystemColorMode: false,
});

export default theme;
