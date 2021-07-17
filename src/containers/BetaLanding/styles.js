import styled from "styled-components";
import {
  Box,
  Text,
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionIcon as ChakraAccordionIcon,
  AccordionPanel as ChakraAccordionPanel
} from "@chakra-ui/react"

export const LogoRistek = styled.img`
  transform: translate(0, 20px);
  margin: auto;
  width: 178px;

  @media (min-width: 480px) {
    width: initial;
  }
`

export const LogoSunjadBeta = styled.img`
  padding-left: 1rem;
  max-width: 280px;
  margin: auto;

  @media (min-width: 480px) {
    max-width: 380px;
  }

  @media (min-width: 768px) {
    max-width: initial;
  }
`

export const AssetBauhaus = styled.img`
  transform: translate(0, -120px);
  position: absolute;
  margin: 0 -24px;
  display: block;
  width: 100%;

  @media (min-width: 480px) {
    display: none;
  }
`

export const AssetBeta = styled.img`
  margin-bottom: 2rem;

  @media (min-width: 900px) {
    margin-bottom: 0rem;
  }
`

export const AssetBetaA = styled(AssetBeta)`
  width: 50%;

  @media (min-width: 900px) {
    width: 60%;
  }
`

export const AssetBetaB = styled(AssetBeta)`
  width: 75%;

  @media (min-width: 900px) {
    width: 85%;
  }
`

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
  fontWeight: "600",
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