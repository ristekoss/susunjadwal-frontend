import styled from "styled-components";
import {
  Image,
  Text,
  Box,
} from "@chakra-ui/react";

export const HeroSection = styled(Box).attrs({
  minW: "100%",
  minH: "calc(100vh - 120px)",
  position: "relative",
  display: "flex",
  flexDir: "column",
  alignItems: { base: "center", lg: "flex-start" },
  pt: { base: "20%", lg: "0%" }
})``

export const LogoRistek = styled(Image).attrs({
  w: { base: "178px", semiMd: "initial" },
  mb: "12.2px"
})``

export const Header = styled(Text).attrs({
  fontWeight: "700",
  fontSize: { base: "2.75rem", lg: "4rem" }
})`span { color: #5038BC; }`

export const AssetChevron = styled(Image).attrs({
  position: "absolute",
  left: "calc(50% - 19px)",
  bottom: "15%",
  m: "auto"
})``