import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";

import {
  Title,
  GapBox,
  FlexBox,
  FlexItem,
  TextBox,
  Paragraph,
  AssetBetaA,
  AssetBetaB,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AssetBauhaus,
  LogoRistek,
  LogoSunjadBeta
} from "./styles";
import { FAQS } from "./data";
import { Bauhaus } from 'components/Bauhaus';

import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
import BetaAssetA from "assets/Beta/beta-landing-asset-1.svg";
import BetaAssetB from "assets/Beta/beta-landing-asset-2.svg";

const BetaLanding = () => {
  return (
    <Box px={{ base: "0px", lg: "40px" }}>
      <AssetBauhaus src={Bauhaus} alt="bauhaus" />
      <Box>
        <LogoRistek src={RistekBetaLogo} alt="ristek-logo" />
        <LogoSunjadBeta src={SunjadBetaLogo} alt="sunjad-beta-logo" />
      </Box>

      <FlexBox flexDir={{ base: "column-reverse", lg: "row" }}>
        <TextBox>
          <Title>Apa itu SusunJadwal?</Title>
          <Paragraph>
            SusunJadwal merupakan situs untuk membantu kamu menentukan jadwal kuliah
            yang akan kamu ambil dalam suatu semester. Dengan SusunJadwal, peluang
            kamu menang SIAK War akan lebih besar, loh!
          </Paragraph>
        </TextBox>
        <FlexItem display="flex" justifyContent="center">
          <AssetBetaA src={BetaAssetA} alt="beta-landing-asset-1" />
        </FlexItem>
      </FlexBox>

      <FlexBox flexDir={{ base: "column", lg: "row" }}>
        <FlexItem display="flex" justifyContent={{ base: "center", lg: "flex-start" }} >
          <AssetBetaB src={BetaAssetB} alt="beta-landing-asset-2" />
        </FlexItem>
        <TextBox>
          <Title>Jadilah beta tester SusunJadwal!</Title>
          <Paragraph>
            Mau membantu kami meningkatkan kualitas SusunJadwal? Jadilah beta tester kami
            untuk mencobafitur-fitur yang ada pada SusunJadwal sebelum SIAK War dimulai!
          </Paragraph>
          <Link to="/beta-form" >
            <Button mt={{ base: "1rem", lg: "1.75rem" }} w="fit-content">Jadi Beta Tester</Button>
          </Link>
        </TextBox>
      </FlexBox>

      <GapBox>
        <Title>Beta Testing FAQs</Title>
        <Accordion>
          {FAQS.map((el, id) => (
            <AccordionItem key={id}>
              <AccordionButton>
                <Box flex="1" textAlign="left">{el.question}</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>{el.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </GapBox>
    </Box>
  )
};

export default BetaLanding;