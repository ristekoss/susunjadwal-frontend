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

export const Icon = styled.img`
  width: 64px;
  margin-bottom: 12px;
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

export const SubHead = styled(Text).attrs({
  fontWeight: "700",
})`
  font-size: 24px @media (min-width: 768px) {
    font-size: 32px;
  }

  span {
    color: #5038bc;
  }
`;

export const SubBody = styled(Text).attrs({
  marginTop: "12px",
})`
    font-size: 12px
    text-align: center

    @media (min-width: 768px) {
        font-size: 16px
    }
    `;

export const SubHeadDesktop = styled(Text).attrs({
  fontWeight: "700",
  fontSize: "32px",
  padding: "24px 0 24px 0",
})`
  text-align: center;
  display: none !important;

  @media (min-width: 1200px) {
    text-align: left;
  }

  @media (min-width: 768px) {
    display: block !important;
  }

  span {
    color: #5038bc;
  }
`;

export const SubHeadMobile = styled(Text).attrs({
  fontWeight: "700",
  fontSize: "24px",
  padding: "24px 0 24px 0",
})`
  text-align: center;
  display: block !important;

  @media (min-width: 1200px) {
    text-align: left;
  }

  @media (min-width: 768px) {
    display: none !important;
  }

  span {
    color: #5038bc;
  }
`;

export const Number = styled(Text).attrs({
  fontWeight: "700",
  fontSize: { base: "3rem", md: "4rem" },
  color: "#5038BC",
})``;

export const NumberDesc = styled(Text).attrs({
  fontSize: { base: "0.75rem", md: "1rem" },
})``;

export const Card = styled(Box).attrs({
  position: "relative",
  borderRadius: "56px",
  background: "linear-gradient(170deg, #E1E5FE 0%, #DAD2FF 100%)",
})``;

export const CardHover = styled(Box).attrs({
  position: "absolute",
  background: "white",
  width: "100%",
  height: "100%",
  borderRadius: "56px",
  opacity: "1",
  transition: "0.2s ease-in",
})``;

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
  flexDir: { base: "column", md: "row" },
  mt: { base: "1.25rem ", md: "3rem " },
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
  display: none !important;

  @media (min-width: 768px) {
    margin-top: 4.5rem;
    display: inline-flex !important;
  }
`;

export const CTAButtonMobile = styled(Button).attrs({})`
  margin-top: 2.5rem;
  display: inline-flex !important;

  @media (min-width: 768px) {
    margin-top: 4.5rem;
    display: none !important;
  }
`;

export const DiscDesktop = styled.img`
  display: none !important;
  @media (min-width: 768px) {
    display: block !important;
  }
`;

export const DiscMobile = styled.img`
  display: block !important;
  @media (min-width: 768px) {
    display: none !important;
  }
`;
