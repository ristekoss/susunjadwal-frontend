import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
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
import HackLogo from "assets/Beta/HackPlus.svg";
import HackDarkLogo from "assets/Beta/HackPlus-dark.svg";
import MapPoint from "assets/Beta/MapPoint.svg";
import MapPointDark from "assets/Beta/MapPoint-dark.svg";

// import RistekLogoLight from "assets/Logo/RistekLogo-light-2025.svg";
// import RistekLogoDark from "assets/Logo/RistekLogo-dark-2025.svg";
// import RistekLogoLight from "assets/Logo/RistekLogo-2026.svg";
import RistekLogoDark from "assets/Logo/RistekLogo-2026.svg";
import RistekLogoLight from "assets/Logo/RistekLogoLight-2026.svg";

import SocialContainer from "./SocialCointainer";

const Footer = () => {
  const location = useLocation();
  const theme = useColorModeValue("light", "dark");
  if (
    ["/susun", "/admin", "/feedback-recap"].includes(location.pathname) ||
    location.pathname.startsWith("/edit/")
  ) {
    return null;
  }
  return (
    <StyledFooterContainer mode={theme}>
      <Flex
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        textAlign={{ base: "center", lg: "left" }}
      >
        <Image
          src={theme === "light" ? RistekLogoDark : RistekLogoLight}
          alt=""
          objectFit="contain"
          mx={{ base: "auto", lg: 0 }}
          mb="8"
          h="44px"
        />
        <StyledFooterDesc>
          <StyledLocation mode={theme}>
            <Image
              mr="3"
              objectFit="contain"
              src={theme === "light" ? MapPoint : MapPointDark}
              alt="MapPoint"
            />
            <Text color="purple.500">Universitas Indonesia, Depok</Text>
          </StyledLocation>
          <Text
            fontWeight="normal"
            fontSize="sm"
            align={{ base: "center", md: "left" }}
            color={theme === "light" ? "secondary.MineShaft" : "dark.White"}
          >
            RISTEK is a United States of America fiscally sponsored 501(c)(3)
            non-profit organization established by students from Faculty of
            Computer Science, Universitas Indonesia.
          </Text>
          <Text
            fontWeight="normal"
            fontSize="sm"
            marginTop="20px"
            align={{ base: "center", md: "left" }}
            color={theme === "light" ? "secondary.MineShaft" : "dark.White"}
          >
            <p style={{ fontWeight: 600 }}>Contact us (Email): </p>
            <p style={{ color: "#F6339A" }}>help@ristek.cs.ui.ac.id</p>
          </Text>
        </StyledFooterDesc>

        <StyledPartner>
          <StyledSpanWrapper>
            <a
              style={{
                paddingLeft: "1rem",
              }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://hackplus.io/"
            >
              <StyledPartnerTitle mode={theme}>
                Accelerated by
              </StyledPartnerTitle>
              <Image
                objectFit="contain"
                width={{ base: 28, lg: 32 }}
                src={theme === "light" ? HackLogo : HackDarkLogo}
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
          color={theme === "light" ? "secondary.MineShaft" : "dark.White"}
        >
          © {new Date().getFullYear()} RISTEK Fasilkom
        </Text>
        <SocialContainer />
      </Box>
    </StyledFooterContainer>
  );
};

export default Footer;
