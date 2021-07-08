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

export const LogoRistek = styled(Image).attrs({
  m: "auto",
  objectFit: "contain",
  sx: { transform: "translate(0, 20px)" },
  w: { base: "178px", semiMd: "initial" },
})``

export const LogoSunjadBeta = styled(Image).attrs({
  m: "auto",
  objectFit: "contain",
  pl: { base: "1rem", md: "0px" },
  maxW: { base: "280px", semiMd: "380px", lg: "initial" },
})``

export const AssetBauhaus = styled(Image).attrs({
  m: "auto",
  w: "100%",
  objectFit: "contain",
  sx: { transform: "translate(0, -120px)" },
  display: { base: "block", semiMd: "none" },
  position: "absolute",
  margin: "0 -24px",
})``

export const AssetBeta = styled(Image).attrs({
  mb: { base: "2rem", lg: "0rem" }
})``

export const AssetBetaA = styled(AssetBeta).attrs({
  w: { base: "50%", lg: "60%" }
})``

export const AssetBetaB = styled(AssetBeta).attrs({
  w: { base: "75%", lg: "85%" }
})``

export const Title = styled(Text).attrs({
  mb: "1rem",
  fontWeight: "900",
  fontSize: { base: "1.5rem", lg: "2rem" },
  textAlign: { base: "center", lg: "left" }
})`span { color: #5038BC; }`

export const Paragraph = styled(Text).attrs({
  width: { base: "100%", lg: "90%" },
  textAlign: { base: "center", lg: "justify" },
  fontSize: { base: "0.875rem", lg: "1rem" },
  lineHeight: "1.5625rem"
})``

export const GapBox = styled(Box).attrs({
  mt: "5rem",
})``

export const FlexBox = styled(GapBox).attrs({
  display: "flex",
})``

export const FlexItem = styled(Box).attrs({
  minW: { base: "100%", lg: "50%" },
  textAlign: { base: "center", lg: "left" },
})``

export const TextBox = styled(FlexItem).attrs({
  display: "flex",
  flexDir: "column",
  alignItems: { base: "center", lg: "initial"},
  justifyContent: "center"
})``

export const Accordion = styled(ChakraAccordion).attrs({
  mt: { base: "2.25rem" , lg: "2.75rem" },
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
  outline: "0 !important",
  boxShadow: "none !important",
  _hover: { background: "initial" }
})``

export const AccordionPanel = styled(ChakraAccordionPanel).attrs({
  p: "0",
  mt: "1rem"
})``

export const AccordionIcon = styled(ChakraAccordionIcon).attrs({
  color: "#5038BC"
})``