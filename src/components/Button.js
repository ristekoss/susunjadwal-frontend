

const Button = {
  baseStyle: {
    fontWeight: "600",
    borderRadius: "8px",
    maxW: "100%",
  },

  sizes: {
    sm: {
      fontSize: "sm",
      px: '26px', // <-- px is short for paddingLeft and paddingRight
      py: '12px', // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: '40px', // <-- these values are tokens from the design system
      py: '16px', // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "primary.Purple",
      color: "primary.Purple",
      _hover: {
        bg: "secondary.LightPurple",
      },
      _active: {
        bg: "secondary.LightPurple",
      },
    },
    solid: {
      bg: "primary.Purple",
      color: "white",
      _hover: {
        bg: "secondary.DarkPurple",
      },
      _active: {
        bg: "secondary.DarkPurple",
      },
    },
    ghost: {
      bg: "trasparent",
      color: "primary.Purple",
      _hover: {
        bg: "secondary.LightPurple",
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    variant: "solid",
  },
};

export default Button