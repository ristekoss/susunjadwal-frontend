import { Box, Image } from '@chakra-ui/react'
import React from 'react'

import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";

const BetaLanding = () => {
  return (
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
  )
}

export default BetaLanding