import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import BauhausLeft from "assets/Beta/bauhaus-left.svg";
import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";
import BauhausDarkDesktop from "assets/Beta/bauhaus-dark-lg.svg";

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: ${({ isPrivate }) => (isPrivate ? "81px" : "0")};

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

export const Bauhaus = ({ isPrivate, mode }) => {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <>
      {isMobile ? (
        <AssetBauhaus
          isMobile={isMobile}
          src={BauhausMobile}
          alt="bauhaus-sm"
        />
      ) : (
        <AssetBauhaus
          isPrivate={isPrivate}
          src={mode === "light" ? BauhausDesktop : BauhausDarkDesktop}
          alt="bauhaus-lg"
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
