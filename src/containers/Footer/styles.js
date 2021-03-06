import { Box, Text } from "@chakra-ui/react";
import styled from "styled-components";

export const StyledFooterContainer = styled(Box).attrs({
  color: "secondary.MineShaft",
  bg: ({ mode }) => (mode === "light" ? "primary.Alabaster" : "#222222"),
  px: { base: 6, lg: 20 },
  py: { base: 8, lg: 12 },
  position: "sticky",
})``;

export const StyledFooterDesc = styled(Box).attrs({
  width: "full",
  mx: { base: "auto", lg: 10 },
  textAlign: "center",
  mb: { base: 8, lg: 16 },
  maxW: "454px",
})``;

export const StyledLocation = styled(Text).attrs({
  fontWeight: "semibold",
  width: "fit-content",
  mx: { base: "auto", md: "0" },
  justify: { base: "center", lg: "start" },
  mb: 4,
  color: ({ mode }) =>
    mode === "light" ? "secondary.MineShaft" : "dark.White",
  display: "flex",
  alignItems: "center",
})``;

export const StyledPartner = styled(Box).attrs({
  width: "full",
  maxW: "350px",
  mb: { base: 8, lg: 16 },
  textAlign: { base: "center", lg: "left" },
  mx: { base: "auto", lg: 0 },
})``;

export const StyledSpanWrapper = styled(Box).attrs({
  justifyItems: { base: "center", lg: "start" },
  display: "inline-flex",
})``;

export const StyledPartnerTitle = styled(Text).attrs({
  display: "flex",
  justifyContent: { base: "center", lg: "start" },
  fontSize: { base: "xs", lg: "sm" },
  mb: "4",
  color: ({ mode }) =>
    mode === "light" ? "secondary.MineShaft" : "dark.White",
  alignItems: "center",
  fontWeight: "semibold",
})``;

export const StyledIconWrapper = styled(Box).attrs({
  width: "full",
  display: "flex",
  justifyContent: "between",
  maxW: "351px",
})`
  @media only screen and (max-width: 900px) {
    & img {
      width: 20px;
    }
  }
`;
