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
  width: 178px;

  @media (min-width: 640px) {
    width: initial;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

export const Header = styled(Text).attrs({
  fontWeight: "700",
  marginBottom: "16px",
})`
  font-size: 2.75rem;
  @media (min-width: 640px) {
    font-size: 4rem;
  }

  span {
    color: #5038bc;
  }
`;

export const SubHead = styled(Text).attrs({
  fontWeight: "700",
})`
  font-size: 24px;

  @media (min-width: 640px) {
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

    @media (min-width: 640px) {
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

  @media (min-width: 640px) {
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

  @media (min-width: 640px) {
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

export const AssetChevronDown = styled.img`
  position: absolute;
  left: calc(50% - 19px);
  bottom: 5%;
  top: 104%;

  @media (min-width: 480px) {
    top: auto;
  }
`;

export const AssetChevronUp = styled.img`
  display: none;
  right: 120px;
  z-index: 1;

  @media (min-width: 1080px) {
    display: block;
  }
`;

export const LinkBox = styled(Box).attrs({
  display: "flex",
  mt: "1.5rem",
})`
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const Description = styled(Text).attrs({
  width: { base: "80%", md: "500px" },
  lineHeight: "1.5625rem",
})`
  text-align: center;
  font-size: 0.875rem;

  @media (min-width: 1200px) {
    align-items: flex-start;
    text-align: left;
  }

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  span {
    font-weight: 700;
  }
`;

export const DiscDesktop = styled.img`
  display: none !important;
  @media (min-width: 640px) {
    display: block !important;
  }
`;

export const DiscMobile = styled.img`
  display: block !important;
  @media (min-width: 640px) {
    display: none !important;
  }
`;

export const CTAButtonDesktop = styled(Button).attrs({})`
  margin-top: 2.5rem;
  display: none !important;

  @media (min-width: 640px) {
    margin-top: 4.5rem;
    display: inline-flex !important;
  }
`;

export const CTAButtonMobile = styled(Button).attrs({})`
  margin-top: 2.5rem;
  display: inline-flex !important;

  @media (min-width: 640px) {
    display: none !important;
  }

  @media (min-width: 480px) {
    margin-top: 4.5rem;
  }
`;

export const DiscordButton = styled(Button).attrs({})`
  width: 320px !important;
  height: 44px !important;
  font-size: 14px @media (min-width: 768px) {
    height: 57px !important;
    font-size: 16px;
  }

  @media (min-width: 640px) {
    width: fit-content !important;
  }
`;
