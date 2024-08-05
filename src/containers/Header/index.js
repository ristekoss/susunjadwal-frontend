import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// import { useMixpanel } from "hooks/useMixpanel";
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
  { to: "/ulasan", label: "Ulasan" },
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

  if (["/admin", "/feedback-recap"].includes(pathname)) return null;

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
            className="switch switch-darkmode"
            style={{
              marginRight: isMobile ? "1rem" : "2rem",
              marginTop: isMobile ? "0px" : "7px",
            }}
          >
            <label class="switch">
              <input
                type="checkbox"
                onClick={() => {
                  toggleColorMode();
                  // TODO: Re-enable mixpanel or change to other analytics
                  // if (theme === "light") useMixpanel.track("dark_mode");
                  // else useMixpanel.track("light_mode");
                }}
                checked={theme === "light" ? false : true}
              />
              <span class="slider">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="sun"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.5 0C9.81494 0 10.117 0.125111 10.3397 0.347811C10.5624 0.57051 10.6875 0.872555 10.6875 1.1875V2.375C10.6875 2.68994 10.5624 2.99199 10.3397 3.21469C10.117 3.43739 9.81494 3.5625 9.5 3.5625C9.18505 3.5625 8.88301 3.43739 8.66031 3.21469C8.43761 2.99199 8.3125 2.68994 8.3125 2.375V1.1875C8.3125 0.872555 8.43761 0.57051 8.66031 0.347811C8.88301 0.125111 9.18505 0 9.5 0ZM14.25 9.5C14.25 10.7598 13.7496 11.968 12.8588 12.8588C11.968 13.7496 10.7598 14.25 9.5 14.25C8.24022 14.25 7.03204 13.7496 6.14124 12.8588C5.25044 11.968 4.75 10.7598 4.75 9.5C4.75 8.24022 5.25044 7.03204 6.14124 6.14124C7.03204 5.25044 8.24022 4.75 9.5 4.75C10.7598 4.75 11.968 5.25044 12.8588 6.14124C13.7496 7.03204 14.25 8.24022 14.25 9.5ZM13.699 15.3781L14.5386 16.2177C14.7625 16.434 15.0625 16.5537 15.3739 16.551C15.6852 16.5483 15.983 16.4234 16.2032 16.2032C16.4234 15.983 16.5483 15.6852 16.551 15.3739C16.5537 15.0625 16.434 14.7625 16.2177 14.5386L15.3781 13.699C15.1542 13.4827 14.8542 13.363 14.5428 13.3657C14.2315 13.3684 13.9336 13.4933 13.7135 13.7135C13.4933 13.9336 13.3684 14.2315 13.3657 14.5428C13.363 14.8542 13.4827 15.1542 13.699 15.3781ZM16.2165 2.78231C16.4391 3.005 16.5642 3.30699 16.5642 3.62188C16.5642 3.93676 16.4391 4.23875 16.2165 4.46144L15.3781 5.301C15.2686 5.41442 15.1375 5.50488 14.9927 5.56712C14.8478 5.62936 14.692 5.66211 14.5343 5.66349C14.3766 5.66486 14.2202 5.63481 14.0743 5.5751C13.9284 5.51539 13.7958 5.42722 13.6843 5.31572C13.5728 5.20422 13.4846 5.07163 13.4249 4.9257C13.3652 4.77976 13.3351 4.62339 13.3365 4.46571C13.3379 4.30804 13.3706 4.15221 13.4329 4.00733C13.4951 3.86245 13.5856 3.73142 13.699 3.62188L14.5386 2.78231C14.7613 2.55969 15.0632 2.43463 15.3781 2.43463C15.693 2.43463 15.995 2.55969 16.2177 2.78231H16.2165ZM17.8125 10.6875C18.1274 10.6875 18.4295 10.5624 18.6522 10.3397C18.8749 10.117 19 9.81494 19 9.5C19 9.18505 18.8749 8.88301 18.6522 8.66031C18.4295 8.43761 18.1274 8.3125 17.8125 8.3125H16.625C16.3101 8.3125 16.008 8.43761 15.7853 8.66031C15.5626 8.88301 15.4375 9.18505 15.4375 9.5C15.4375 9.81494 15.5626 10.117 15.7853 10.3397C16.008 10.5624 16.3101 10.6875 16.625 10.6875H17.8125ZM9.5 15.4375C9.81494 15.4375 10.117 15.5626 10.3397 15.7853C10.5624 16.008 10.6875 16.3101 10.6875 16.625V17.8125C10.6875 18.1274 10.5624 18.4295 10.3397 18.6522C10.117 18.8749 9.81494 19 9.5 19C9.18505 19 8.88301 18.8749 8.66031 18.6522C8.43761 18.4295 8.3125 18.1274 8.3125 17.8125V16.625C8.3125 16.3101 8.43761 16.008 8.66031 15.7853C8.88301 15.5626 9.18505 15.4375 9.5 15.4375ZM3.62188 5.301C3.73213 5.41133 3.86303 5.49887 4.00711 5.55861C4.1512 5.61835 4.30563 5.64912 4.46161 5.64918C4.61759 5.64923 4.77205 5.61857 4.91617 5.55893C5.0603 5.49929 5.19126 5.41185 5.30159 5.30159C5.41192 5.19134 5.49946 5.06044 5.5592 4.91635C5.61894 4.77227 5.64972 4.61783 5.64977 4.46186C5.64983 4.30588 5.61916 4.15142 5.55952 4.0073C5.49988 3.86317 5.41244 3.73221 5.30219 3.62188L4.46144 2.78231C4.23747 2.566 3.93751 2.44631 3.62615 2.44901C3.31479 2.45172 3.01695 2.57661 2.79678 2.79678C2.57661 3.01695 2.45172 3.31479 2.44901 3.62615C2.44631 3.93751 2.566 4.23747 2.78231 4.46144L3.62188 5.301ZM5.301 15.3781L4.46144 16.2177C4.23747 16.434 3.93751 16.5537 3.62615 16.551C3.31479 16.5483 3.01695 16.4234 2.79678 16.2032C2.57661 15.983 2.45172 15.6852 2.44901 15.3739C2.44631 15.0625 2.566 14.7625 2.78231 14.5386L3.62188 13.699C3.84584 13.4827 4.14581 13.363 4.45716 13.3657C4.76852 13.3684 5.06636 13.4933 5.28653 13.7135C5.50671 13.9336 5.63159 14.2315 5.6343 14.5428C5.63701 14.8542 5.51731 15.1542 5.301 15.3781ZM2.375 10.6875C2.68994 10.6875 2.99199 10.5624 3.21469 10.3397C3.43739 10.117 3.5625 9.81494 3.5625 9.5C3.5625 9.18505 3.43739 8.88301 3.21469 8.66031C2.99199 8.43761 2.68994 8.3125 2.375 8.3125H1.1875C0.872555 8.3125 0.57051 8.43761 0.347811 8.66031C0.125111 8.88301 0 9.18505 0 9.5C0 9.81494 0.125111 10.117 0.347811 10.3397C0.57051 10.5624 0.872555 10.6875 1.1875 10.6875H2.375Z"
                    fill="#FF9700"
                  />
                </svg>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="moon"
                >
                  <path
                    d="M9.59245 9.40785C8.38547 8.20036 7.56349 6.66218 7.23038 4.98768C6.89726 3.31318 7.06797 1.57751 7.72092 0C5.85923 0.366501 4.14918 1.28001 2.80946 2.62368C-0.936486 6.36975 -0.936486 12.444 2.80946 16.1901C6.55636 19.9371 12.6295 19.9362 16.3764 16.1901C17.7197 14.8505 18.6331 13.1408 19 11.2794C17.4225 11.9323 15.6869 12.1029 14.0125 11.7698C12.3381 11.4367 10.8 10.6148 9.59245 9.40785Z"
                    fill="#E5E5E5"
                  />
                </svg>
              </span>
            </label>
          </div>
          {isMobile && auth && (
            <>
              <WrapperHamburger open={isOpen} onClick={toggleMenu}>
                <HamburgerIcon mode={theme} />
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
      {pathname !== "/feedback-recap" &&
        LINKS.map(({ to, label }) => (
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
  const theme = useColorModeValue("light", "dark");
  return (
    <Drawer
      initialFocusRef={firstField}
      onClose={onClose}
      isOpen={isOpen}
      size="full"
    >
      <DrawerOverlay bg="transparent" />
      <DrawerContent
        maxW="undefined"
        px="1.5rem"
        bg={theme === "light" ? "white" : "dark.Black"}
      >
        <DrawerBody d="contents" dir="col" textAlign="left">
          {LINKS.map(({ to, label }) => (
            <HeaderLink
              isCurrent={pathname === to}
              onClick={onClose}
              key={to}
              to={to}
              mode={theme}
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
