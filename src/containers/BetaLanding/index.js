import React from "react"
import {
  Box,
  Image,
  Text
} from "@chakra-ui/react"

import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
import BetaAssetA from "assets/Beta/beta-landing-asset-1.svg";
import BetaAssetB from "assets/Beta/beta-landing-asset-2.png";
import Bauhaus from "assets/Beta/decor1.svg";

const BetaLanding = () => {
  return (
    <>
      <Image
        objectFit="contain"
        m="auto"
        src={Bauhaus}
        alt="bauhaus-decor"
        sx={{ transform: "translate(0, -120px)" }}
        w="100%"
        display={{ base: "block", semiMd: "none" }}
        position="absolute"
        margin="0 -24px"
      />
      <Box>
        <Image
          objectFit="contain"
          m="auto"
          src={RistekBetaLogo}
          alt="ristek beta"
          sx={{ transform: "translate(0, 20px)" }}
          w={{ base: "178px", semiMd: "initial" }}
        />
        <Image
          objectFit="contain"
          m="auto"
          src={SunjadBetaLogo}
          alt="sunjad beta"
          maxW={{ base: "280px", semiMd: "380px", lg: "initial" }}
        />
      </Box>
      <Box
        display="flex"
        flexDir={{ base: "column", semiMd: "row" }}
      >
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          textAlign={{ base: "center", semiMd: "left" }}
          display="flex"
          alignItems="center"
        >
          <Box>
            <Text>Apa itu SusunJadwal?</Text>
            <Text>
              SusunJadwal merupakan situs untuk membantu kamu menentukan jadwal kuliah
              yang akan kamu ambil dalam suatu semester. Dengan SusunJadwal, peluang
              kamu menang SIAK War akan lebih besar, loh!
            </Text>
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
      </Box>
      <Box
        display="flex"
        flexDir={{ base: "column", semiMd: "row" }}
      >
        <Box
          minW={{ base: "100%", semiMd: "50%" }}
          display="flex"
          justifyContent="center"
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
            <Text>Jadilah beta tester SusunJadwal!</Text>
            <Text>
              Mau membantu kami meningkatkan kualitas SusunJadwal? Jadilah beta tester kami
              untuk mencobafitur-fitur yang ada pada SusunJadwal sebelum SIAK War dimulai!
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default BetaLanding