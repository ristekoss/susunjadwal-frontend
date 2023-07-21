import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import BauhausLeft from "assets/Beta/bauhaus-left.svg";

import illustrationDesktop from "assets/Beta/illustration-lg.svg";
import illustrationMobile from "assets/Beta/illustration-sm.svg";

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: ${({ isPrivate }) => (isPrivate ? "81px" : "0")};
  display:none

  @media (min-width: 1200px) {
    display: block
    width: 40rem;
  }

  ${(props) =>
    props.isMobile &&
    `
    width: 100%;
    display: block;

    @media (min-width: 480px) {
      display: none;
    }
  `}
`;

const AssetBauhausSide = styled.img`
  position: fixed;
  height: 100vh;
  top: -2px;
  left: 0;
  z-index: 4;

  ${(props) => props.isMobile && "display: none;"}
`;

export const Bauhaus = ({ isPrivate }) => {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <>
      {isMobile ? (
        <AssetBauhaus
          isMobile={isMobile}
          src={illustrationMobile}
          alt="illustration-sm"
        />
      ) : (
        <AssetBauhaus
          isPrivate={isPrivate}
          src={illustrationDesktop}
          alt="illustration-lg"
        />
      )}
    </>
  );
};

export const BauhausSide = () => {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <AssetBauhausSide
      isMobile={isMobile}
      src={BauhausLeft}
      alt="bauhaus-left"
    />
  );
};
