import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import illustrationDesktop from "assets/Beta/illustration-lg.svg";
import illustrationMobile from "assets/Beta/illustration-sm.svg";

const AssetIllustration = styled.img`
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

export const Illustration = ({ isPrivate }) => {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <>
      {isMobile ? (
        <AssetIllustration
          isMobile={isMobile}
          src={illustrationMobile}
          alt="illustration-sm"
        />
      ) : (
        <AssetIllustration
          isPrivate={isPrivate}
          src={illustrationDesktop}
          alt="illustration-lg"
        />
      )}
    </>
  );
};
