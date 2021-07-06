import React from "react";
import {
  Box,
  Image,
} from "@chakra-ui/react";

import Bauhaus from "assets/Beta/decor1.svg";
import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
import BetaAssetA from "assets/Beta/beta-landing-asset-1.svg";
import BetaAssetB from "assets/Beta/beta-landing-asset-2.svg";
import {
  Title,
  GapBox,
  FlexBox,
  Paragraph,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AssetBauhaus,
  LogoRistek,
  LogoSunjadBeta
} from "./styles";

const BetaLanding = () => {
  return (
    <>
      <AssetBauhaus
        src={Bauhaus}
        alt="bauhaus"
      />
      <Box>
        <LogoRistek
          src={RistekBetaLogo}
          alt="ristek-logo"
        />
        <LogoSunjadBeta
          src={SunjadBetaLogo}
          alt="sunjad-beta-logo"
        />
      </Box>
      <FlexBox>
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          textAlign={{ base: "center", semiMd: "left" }}
          display="flex"
          alignItems="center"
        >
          <Box>
            <Title>Apa itu SusunJadwal?</Title>
            <Paragraph>
              SusunJadwal merupakan situs untuk membantu kamu menentukan jadwal kuliah
              yang akan kamu ambil dalam suatu semester. Dengan SusunJadwal, peluang
              kamu menang SIAK War akan lebih besar, loh!
            </Paragraph>
          </Box>
        </Box>
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={BetaAssetA}
            alt="beta-landing-asset-1"
          />
        </Box>
      </FlexBox>
      <FlexBox>
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Image
            src={BetaAssetB}
            alt="beta-landing-asset-2"
          />
        </Box>
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          textAlign={{ base: "center", semiMd: "left" }}
          display="flex"
          alignItems="center"
        >
          <Box>
            <Title>Jadilah beta tester SusunJadwal!</Title>
            <Paragraph>
              Mau membantu kami meningkatkan kualitas SusunJadwal? Jadilah beta tester kami
              untuk mencobafitur-fitur yang ada pada SusunJadwal sebelum SIAK War dimulai!
            </Paragraph>
          </Box>
        </Box>
      </FlexBox>
      <GapBox>
        <Title>Beta Testing FAQs</Title>
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon color="purple" />
            </AccordionButton>
            <AccordionPanel>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </GapBox>
    </>
  )
};

export default BetaLanding;