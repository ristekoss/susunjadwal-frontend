import { Box, Button, Image, Input } from '@chakra-ui/react'
import React from 'react'
import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
// import decorLandingTop from "assets/Beta/decor1.svg";

const Landing = () => {
  return (
    <Box>
      {/* <Image 
        objectFit="contain"
        position='absolute'
        zIndex='1000'
        top='0'
        left='0'
        src={decorLandingTop}
        alt="decor"
        display={{base: 'block', semiMd:'none'}}
        w='full'
      /> */}
      <Image 
        objectFit="contain"
        m='auto'
        src={RistekBetaLogo}
        alt="ristek beta"
        sx={{transform: 'translate(0, 20px)'}}
        w={{base: '178px', semiMd:'initial'}}
      />
      <Image
        objectFit="contain"
        m='auto'
        src={SunjadBetaLogo}
        alt="sunjad beta"
        maxW={{base: '280px', semiMd:'380px', lg:'initial'}}
      />
      <Button variant="solid" >Jadi Beta Tester</Button>
      <Button variant="solid" >Daftar</Button>
      <Button variant="ghost" >Jadi Beta Tester</Button>
      <Input variant="filled" placeholder="nama" />
    </Box>
  )
}

export default Landing
