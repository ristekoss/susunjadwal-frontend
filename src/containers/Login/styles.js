import { Text, Box } from "@chakra-ui/react";
import styled from "styled-components";

export const HeroSection = styled(Box).attrs({
  minW: "100%",
  minH: "calc(100vh - 120px)",
  position: "relative",
  display: "flex",
  flexDir: "column",
  alignItems: { base: "center", lg: "flex-start" },
  pt: { base: "20%", lg: "0%" },
})``;

export const LogoRistek = styled.img`
  margin-bottom: 4.5rem;
  width: 178px;

  @media (min-width: 480px) {
    width: initial;
  }
`;

export const Header = styled(Text).attrs({
  fontWeight: "700",
  fontSize: { base: "2.75rem", lg: "4rem" },
})`
  span {
    color: #5038bc;
  }
`;

export const AssetChevron = styled.img`
  position: absolute;
  left: calc(50% - 19px);
  bottom: 15%;
  margin: auto;
`;

export const LinkBox = styled(Box).attrs({
  display: "flex",
  flexDir: { base: "column", lg: "row" },
  mt: { base: "1.25rem ", lg: "3rem " },
})``;

export const Description = styled(Text).attrs({
  width: { base: "100%", lg: "500px" },
  textAlign: { base: "center", lg: "left" },
  fontSize: { base: "0.875rem", lg: "1rem" },
  lineHeight: "1.5625rem",
})`
  span {
    font-weight: 700;
  }
`;
