import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Image,
  useDisclosure,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  Container,
  HamburgerIcon,
  HeaderLink,
  NavLinkWrapper,
  SignOutLink,
  WrapperHamburger,
} from "./styles";

import LogoSunjadLight from "assets/Beta/LogoSunjad-light.svg";
import LogoSunjadDark from "assets/Beta/LogoSunjad-dark.svg";
import Announcement from "components/Announcement";
import "./styles.css";

const LINKS = [
  { to: "/susun", label: "Buat Jadwal" },
  { to: "/jadwal", label: "Daftar Jadwal" },
  { to: "/update", label: "Update Matkul" },
  { to: "/kontributor", label: "Kontributor" },
];

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useColorModeValue("light", "dark");
  const isMobile = useSelector((state) => state.appState.isMobile);
  const auth = useSelector((state) => state.auth);

  function toggleMenu() {
    return isOpen ? onClose() : onOpen();
  }

  return (
    <Container
      style={{ backgroundColor: colorMode === "light" ? "#FFFFFF" : "#2c2c2c" }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Announcement />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box mr="auto">
            <Link to="/">
              <Image
                src={colorMode === "light" ? LogoSunjadLight : LogoSunjadDark}
                alt="logo"
                objectFit="contain"
                w={{ base: "140px", lg: "initial" }}
              />
            </Link>
          </Box>{" "}
          <div
            className="switch"
            style={{
              marginRight: isMobile ? "1rem" : "2rem",
              marginTop: isMobile ? "0px" : "7px",
            }}
          >
            <input
              type="checkbox"
              id="toggle"
              onClick={toggleColorMode}
              checked={theme === "light" ? false : true}
            />
            <label
              for="toggle"
              style={{
                backgroundColor: theme === "light" ? "#FFFFFF" : "#674DE0",
              }}
            ></label>
          </div>
          {isMobile && auth && (
            <>
              <WrapperHamburger open={isOpen} onClick={toggleMenu}>
                <HamburgerIcon />
              </WrapperHamburger>
              <SideBar pathname={pathname} onClose={onClose} isOpen={isOpen} />
            </>
          )}
          {auth && <NavLinks pathname={pathname} />}
        </div>
      </div>
    </Container>
  );
  // The checking above is added for auth only
}

export default Header;

const NavLinks = ({ pathname }) => {
  const theme = useColorModeValue("light", "dark");
  return (
    <NavLinkWrapper>
      {LINKS.map(({ to, label }) => (
        <HeaderLink isCurrent={pathname === to} key={to} to={to} mode={theme}>
          {label}
        </HeaderLink>
      ))}
      <SignOutLink to="/logout">Sign Out</SignOutLink>
    </NavLinkWrapper>
  );
};

const SideBar = ({ onClose, isOpen, pathname }) => {
  const firstField = React.useRef();
  return (
    <Drawer
      initialFocusRef={firstField}
      onClose={onClose}
      isOpen={isOpen}
      size="full"
    >
      <DrawerOverlay bg="transparent" />
      <DrawerContent maxW="undefined" px="1.5rem">
        <DrawerBody d="contents" dir="col" textAlign="left">
          {LINKS.map(({ to, label }) => (
            <HeaderLink
              isCurrent={pathname === to}
              onClick={onClose}
              key={to}
              to={to}
            >
              {label}
            </HeaderLink>
          ))}
          <SignOutLink to="/logout">Sign Out</SignOutLink>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
