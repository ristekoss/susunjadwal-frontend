import React from "react";
import styled from "styled-components";
import { Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";

const AssetBauhaus = styled(Image).attrs({
  position: "absolute",
  right: "0",
  top: "0",
})``

const Bauhaus = () => {
  const isMobile = useSelector(state => state.appState.isMobile);

  return (
    <>
      {isMobile ? (
        <AssetBauhaus
          display={{ base: "block", semiMd: "none" }}
          src={BauhausMobile}
          alt="bauhaus-sm"
          w="100%"
        />
      ) : (
        <AssetBauhaus src={BauhausDesktop} alt="bauhaus-lg" />
      )}
    </>
  )
}

export default Bauhaus;

