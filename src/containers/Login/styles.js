import { Text, Box, Button } from "@chakra-ui/react";
import styled from "styled-components";

export const HeroSection = styled(Box).attrs({
  minW: "100%",
  minH: "calc(100vh - 120px)",
  position: "relative",
  display: "flex",
  flexDir: "column",
})`
  align-items: center;

  @media (min-width: 1200px) {
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding-top: 100%;
  }
`;

export const LogoRistek = styled.img`
  margin-bottom: 4.5rem;
  width: 178px;

  @media (min-width: 480px) {
    width: initial;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

export const Header = styled(Text).attrs({
  fontWeight: "700",
  fontSize: { base: "2.75rem", md: "4rem" },
})`
  span {
    color: #5038bc;
  }
`;

export const AssetChevron = styled.img`
  position: absolute;
  left: calc(50% - 19px);
  bottom: 5%;
  top: 104%;

  @media (min-width: 480px) {
    top: auto;
  }
`;

export const LinkBox = styled(Box).attrs({
  display: "flex",
  flexDir: { base: "column", lg: "row" },
  mt: { base: "1.25rem ", lg: "3rem " },
})``;

export const Description = styled(Text).attrs({
  width: { base: "80%", md: "500px" },
  fontSize: { base: "0.875rem", md: "1rem" },
  lineHeight: "1.5625rem",
})`
  text-align: center;

  @media (min-width: 1200px) {
    align-items: flex-start;
    text-align: left;
  }

  span {
    font-weight: 700;
  }
`;

export const CTAButtonDesktop = styled(Button).attrs({})`
  margin-top: 2.5rem;
  display:none !important @media (min-width: 480px) {
    margin-top: 4.5rem;
    display: inline-flex !important;
  }
`;

export const CTAButtonMobile = styled(Button).attrs({})`
  margin-top: 2.5rem;
  display: inline-flex !important @media (min-width: 480px) {
    margin-top: 4.5rem;
    display: none !important;
  }
`;
