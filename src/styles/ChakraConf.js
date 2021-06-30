// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import Button from './Button'

const styles = {
  global: {
    // styles for the `body`
    body: {
      fontFamily: "Poppins",
    },
  },
};

const breakpoints = createBreakpoints({
  sm: "376px",
  md: "768px",
  lg: "900px",
  xl: "1200px",
});

// 2. Extend the theme to include custom colors, fonts, etc
export const colors = {
  primary: {
    Alabaster: "#F8F8F8",
    White: "#FFFFFF",
    Purple: "#5038BC",
    Malibu: "#64E6FB",
  },
  secondary: {
    Gray: "#828282",
    DarkPurple: "#402D99",
    LightPurple: "#5038BC1A",
    LigthGray: "#F5F5F5",
    Golden: "#FFD668",
    Cerise: "#C424A3",
    MineShaft: "#333333",
  },
  state: {
    Error: "#EB5757",
    Warning: "#F7B500",
    Success: "#27AE60",
  },
};

const theme = extendTheme({
  breakpoints,
  styles,
  colors,
  components: { Button },
});

export default theme;
