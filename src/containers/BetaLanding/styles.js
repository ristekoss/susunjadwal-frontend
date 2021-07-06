import styled from "styled-components";
import {
  Box,
  Text,
  Image,
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionIcon as ChakraAccordionIcon,
  AccordionPanel as ChakraAccordionPanel
} from "@chakra-ui/react"


export const AssetBauhaus = styled(Image).attrs({
  objectFit: "contain",
  m: "auto",
  sx: { transform: "translate(0, -120px)" },
  w: "100%",
  display: { base: "block", semiMd: "none" },
  position: "absolute",
  margin: "0 -24px",
})``

export const LogoRistek = styled(Image).attrs({
  objectFit: "contain",
  m: "auto",
  sx: { transform: "translate(0, 20px)" },
  w: { base: "178px", semiMd: "initial" },
})``

export const LogoSunjadBeta = styled(Image).attrs({
  objectFit: "contain",
  m: "auto",
  pl: { base: "1rem", md: "0px" },
  maxW: { base: "280px", semiMd: "380px", lg: "initial" },
})``

export const Title = styled(Text).attrs({
  mb: "1rem",
  fontWeight: "900",
  fontSize: { base: "1.5rem", md: "2rem" }
})``

export const Paragraph = styled(Text).attrs({
  width: { base: "100%", md: "90%" },
  textAlign: { base: "center", md: "justify" },
  lineHeight: "1.5625rem"
})``

export const GapBox = styled(Box).attrs({
  mt: "5rem",
})``

export const FlexBox = styled(GapBox).attrs({
  display: "flex",
  flexDir: { base: "column", semiMd: "row" }
})``

export const Accordion = styled(ChakraAccordion).attrs({
  mt: "1rem",
  w: { base: "100%", md: "82.5%" },
  allowToggle: "true"
})``

export const AccordionItem = styled(ChakraAccordionItem).attrs({
  p: "18px 1rem",
  mb: "1.5rem",
  background: "#F8F8F8",
  border: "1px solid #BDBDBD",
  borderRadius: "8px",
})``

export const AccordionButton = styled(ChakraAccordionButton).attrs({
  p: "0",
  fontWeight: "bold",
  outline: "none"
})``

export const AccordionPanel = styled(ChakraAccordionPanel).attrs({
  p: "0",
  mt: "1rem"
})``

export const AccordionIcon = styled(ChakraAccordionIcon).attrs({
  color: "#5038BC"
})``