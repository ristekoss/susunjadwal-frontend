import { Box } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const WrapperHamburger = styled(Box).attrs({
  display: { base: "flex", xl: "none" },
  justifyContent: "center",
  alignItems: "center",
  overflowX: "hidden",
  height: 9,
  width: 9,
})`
  transition: all 0.5s ease-in-out;
  ${(props) =>
    props.open &&
    `
    & > :nth-child(1){
      transform: translateX(-45px);
      background: transparent;
    }
    & > :nth-child(1):before {
      transform: rotate(45deg) translate(30px, -30px);
    }
    & > :nth-child(1):after {
      transform: rotate(-45deg) translate(30px, 30px);
    }
  `}
`;

export const HamburgerIcon = styled(Box).attrs({
  width: 6,
  height: 1,
  bg: "primary.Purple",
  borderRadius: "10px",
})`
  transition: all 0.5s ease-in-out;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 1.25rem;
    height: 0.25rem;
    border-radius: 9999px;
    background: #5038bc;
    transition: all 0.5s ease-in-out;
  }
  &:before {
    transform: translateY(-8px);
  }
  &:after {
    transform: translateY(8px);
  }
`;

export const NavLinkWrapper = styled(Box).attrs({
  display: "flex",
  flexDir: { base: "column", lg: "row" },
  justifyContent: { base: "start", lg: "end" },
  alignItems: "center",
})`
  @media only screen and (max-width: 900px) {
    position: absolute;
    opacity: 0;
    left: 100vw;
  }
`;

export const Container = styled(Box).attrs({
  bg: "primary.White",
  py: { base: "14px", lg: "18px" },
  px: { base: "1.5rem", lg: "5rem" },
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  position: "fixed",
  top: "0",
  left: "0",
})`
  width: 100%;
  box-shadow: 0px 0px 5px 0px #00000026;
  z-index: 5;
  position: fixed;
`;

export const HeaderLink = styled(NavLink)`
  float: right;
  line-height: 3rem;
  font-size: 18px;
  font-weight: ${(props) => (props.isCurrent ? "700" : "400")};
  margin-right: 2rem;
  white-space: nowrap;
  color: ${(props) =>
    props.isCurrent
      ? "var(--chakra-colors-primary-Purple)"
      : "var(--chakra-colors-secondary-Gray)"};

  &:hover {
    color: var(--chakra-colors-primary-Purple);
  }
  &:focus {
    color: ${(props) =>
      props.isCurrent
        ? "var(--chakra-colors-primary-Purple)"
        : "var(--chakra-colors-secondary-Gray)"};
    outline: none;
  }
  @media only screen and (max-width: 900px) {
    margin-right: 0;
    font-size: 14px;
  }
`;

export const SignOutLink = styled(NavLink)`
  font-size: 18px;
  white-space: nowrap;
  color: var(--chakra-colors-state-Error) !important;
  @media only screen and (max-width: 900px) {
    font-size: 14px;
    line-height: 3rem;
  }
`;
