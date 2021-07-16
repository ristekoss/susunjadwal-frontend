import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import React from "react";
import {
  StyledFooterContainer,
  StyledFooterDesc,
  StyledLocation,
  StyledPartner,
  StyledPartnerTitle,
  StyledSpanWrapper,
} from "./styles";
import GojekLogo from "assets/Beta/gojek.svg";
import HackLogo from "assets/Beta/HackPlus.svg";
import MapPoint from "assets/Beta/MapPoint.svg";
import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SocialContainer from "./SocialCointainer";

const Footer = () => {
  const location = useLocation();

  if (location.pathname === "/susun")
    return null

  return (
    <StyledFooterContainer>
      <Flex
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        textAlign={{ base: "center", lg: "left" }}
      >
        <Image
          src={RistekBetaLogo}
          alt=""
          objectFit="contain"
          mx={{ base: "auto", lg: 0 }}
          mb="8"
          h="44px"
        />
        <StyledFooterDesc>
          <StyledLocation>
            <Image mr="3" objectFit="contain" src={MapPoint} alt="MapPoint" />
            Universitas Indonesia, Depok
          </StyledLocation>
          <Text
            fontWeight="normal"
            fontSize="sm"
            align={{ base: "center", md: "left" }}
            color="secondary.MineShaft"
          >
            RISTEK is a United States of America fiscally sponsored 501(c)(3)
            non-profit organization established by students from Faculty of
            Computer Science, Universitas Indonesia.
          </Text>
        </StyledFooterDesc>

        <StyledPartner>
          <StyledSpanWrapper>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gojek.com/en-id/"
            >
              <StyledPartnerTitle>Official Learning Partner</StyledPartnerTitle>
              <Image
                objectFit="contain"
                w={{ base: "36", lg: "40" }}
                mr={{ base: "9", lg: "10" }}
                src={GojekLogo}
                alt="logo Gojek"
              />
            </a>
            <a
              style={{
                borderLeftWidth: "1px",
                paddingLeft: "1rem",
                marginLeft: "1rem",
              }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://hackplus.io/"
            >
              <StyledPartnerTitle>Accelerated by</StyledPartnerTitle>
              <Image
                objectFit="contain"
                width={{ base: 28, lg: 32 }}
                src={HackLogo}
                alt="logo hackPlus"
              />
            </a>
          </StyledSpanWrapper>
        </StyledPartner>
      </Flex>

      <Box
        w="full"
        d="flex"
        justifyContent="space-between"
        flexDir={{ base: "column-reverse", lg: "row" }}
        alignItems="center"
      >
        <Text
          mt={{ base: "6", lg: "0" }}
          fontSize="sm"
          color="secondary.MineShaft"
        >
          © 2021 RISTEK Fasilkom
        </Text>
        <SocialContainer />
      </Box>
    </StyledFooterContainer>
  );
};

export default Footer;
