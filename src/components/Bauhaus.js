import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: 0;

  ${props => props.isMobile && (`
    width: 100%;
    display: block;

    @media (min-width: 480px) {
      display: none;
    }
  `)}
`;

const Bauhaus = () => {
  const isMobile = useSelector(state => state.appState.isMobile);

  return (
    <>
      {isMobile ? (
        <AssetBauhaus
          isMobile={isMobile}
          src={BauhausMobile}
          alt="bauhaus-sm"
        />
      ) : (
        <AssetBauhaus src={BauhausDesktop} alt="bauhaus-lg" />
      )}
    </>
  )
};

export default Bauhaus;

