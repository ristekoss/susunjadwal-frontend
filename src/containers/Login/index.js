import { useSelector, useDispatch } from "react-redux";
import { Button, Box, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { parse } from "query-string";

import { persistAuth, persistCompletion } from "utils/auth";
import { setLoading } from "redux/modules/appState";
import { redirectToSSOLogin } from "services/sso";
import { makeAtLeastMs } from "utils/promise";
import { postAuthTicket } from "services/api";
import { setAuth } from "redux/modules/auth";

import { Bauhaus } from "components/Bauhaus";
import Announcement from "components/Announcement";

import makara from "assets/Beta/makara.svg";
import link from "assets/Beta/link.svg";
import totalUser from "assets/Beta/total-user.svg";
import totalJadwal from "assets/Beta/total-jadwal.svg";
import discordDesktop from "assets/Beta/discord-lg.svg";
import discordMobile from "assets/Beta/discord-sm.svg";

import {
  Header,
  Number,
  NumberDesc,
  LinkBox,
  LogoRistek,
  HeroSection,
  AssetChevron,
  Description,
  CTAButtonDesktop,
  CTAButtonMobile,
  SubHead,
  SubHeadDesktop,
  SubHeadMobile,
  DiscDesktop,
  DiscMobile,
  Icon,
  Card,
  CardHover,
  SubBody,
} from "./styles";

import { FlexBox } from "containers/BetaLanding/styles";

import RistekLogo from "assets/Beta/Beta_Logo_Light.svg";
import ChevronArrow from "assets/Beta/chevron-down.svg";

function getServiceUrl() {
  return window.location.href.split("?")[0];
}

function Login({ history, location }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useColorModeValue("light", "dark");

  useEffect(() => {
    async function authenticate(ticket, serviceUrl) {
      try {
        dispatch(setLoading(true));
        const {
          data: {
            token,
            user_id: userId,
            major_id: majorId,
            user_name: username,
            full_name: fullname,
            err: isPeriodMissing,
            completion_id: completionId,
          },
        } = await makeAtLeastMs(postAuthTicket(ticket, serviceUrl), 1000);

        if (completionId !== undefined) {
          persistCompletion({ username, fullname, completionId });
          dispatch(setLoading(false));
          history.replace("/complete");
          return null;
        }

        if (isPeriodMissing) {
          dispatch(setLoading(false));
          persistAuth({ majorId, userId, token });
          history.replace("/update");
          return null;
        } else {
          dispatch(setAuth({ majorId, userId, token }));
        }

        persistAuth({ majorId, userId, token });
      } catch (e) {
        dispatch(setLoading(false));
        history.replace("/");
      }
    }

    const { ticket } = parse(location.search);
    if (ticket) {
      const serviceUrl = getServiceUrl();
      authenticate(ticket, serviceUrl);
    }
  }, [location, dispatch, history]);

  useEffect(() => {
    if (auth?.token) history.push("/susun");
  }, [auth, history]);

  return (
    <Box px={{ base: "0px", lg: "40px" }}>
      <Bauhaus mode={theme} />

      <HeroSection>
        <LogoRistek src={RistekLogo} alt="ristek-logo" />

        <Header>
          Susun<span>Jadwal</span>
        </Header>

        <Description>
          Kamu pernah merasa frustrasi karena kalah SIAKWAR?
          <br />
          <br />
          Gausah takut lagi!
          <span> Susun</span>
          <span style={{ color: "#5038BC" }}>Jadwal </span>
          by RISTEK hadir buat kamu yang mau merencanakan kelas semester depan
          dengan mudah!
        </Description>

        <Announcement />

        <CTAButtonDesktop height="55px" onClick={redirectToSSOLogin}>
          <img src={makara} style={{ marginRight: "0.5rem" }}></img>
          Rencanakan SIAKWAR Sekarang
        </CTAButtonDesktop>

        <CTAButtonMobile
          height="55px"
          width="319px"
          onClick={redirectToSSOLogin}
        >
          <img src={makara} style={{ marginRight: "0.5rem" }}></img>
          Masuk Dengan SSO
        </CTAButtonMobile>

        <a href="#content">
          <AssetChevron src={ChevronArrow} alt="chevron-down" />
        </a>
      </HeroSection>

      <Box
        display="flex"
        id="content"
        flexDir="column"
        justifyContent="center"
        marginTop={{ base: "12rem", md: "6rem" }}
      >
        <SubHeadDesktop>
          Kami telah membantu civitas UI selama
          <span> 10 tahun</span>
        </SubHeadDesktop>

        <SubHeadMobile>
          <span>Our impact </span>
          in numbers...
        </SubHeadMobile>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          flexDir={{ base: "column", lg: "row" }}
        >
          <Card>
            <CardHover _hover={{ opacity: "0" }}></CardHover>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "150px",
                padding: "40px",
                pointerEvents: "none",
              }}
            >
              <Icon src={totalUser}></Icon>
              <h2
                style={{
                  fontWeight: "700",
                  color: "#A8ADF9",
                  fontSize: "20px",
                }}
              >
                Total User
              </h2>
            </Box>

            <Box
              style={{
                display: "block",
                overflow: "auto",
                position: "relative",
                width: "auto",
                borderRadius: "0 0 51px 51px",
                backgroundColor: "#FFFFFF",
                padding: "0 40px 40px 40px",
                margin: "5px",
                pointerEvents: "none",
              }}
            >
              <Number>10.000++</Number>
              <NumberDesc>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </NumberDesc>
            </Box>
          </Card>

          <div style={{ minWidth: "16px", minHeight: "16px" }}></div>

          <Card>
            <CardHover _hover={{ opacity: "0" }}></CardHover>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "150px",
                padding: "40px",
                pointerEvents: "none",
              }}
            >
              <Icon src={totalJadwal}></Icon>
              <h2
                style={{
                  fontWeight: "700",
                  color: "#A8ADF9",
                  fontSize: "20px",
                }}
              >
                Jadwal Created
              </h2>
            </Box>

            <Box
              style={{
                display: "block",
                overflow: "auto",
                position: "relative",
                width: "auto",
                borderRadius: "0 0 51px 51px",
                backgroundColor: "#FFFFFF",
                padding: "0 40px 40px 40px",
                margin: "5px",
                pointerEvents: "none",
              }}
            >
              <Number>26.000++</Number>
              <NumberDesc>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </NumberDesc>
            </Box>
          </Card>
        </Box>
      </Box>

      <FlexBox flexDir="column" alignItems="center">
        <SubHead>
          Kamu Seorang
          <span> Hacker</span>?
        </SubHead>

        <SubBody>
          Berkontribusi ke
          <span style={{ fontWeight: "700" }}>
            {" "}
            Susun
            <span style={{ color: "#5038BC" }}>Jadwal </span>
            Open Source{" "}
          </span>
          lewat RISTEK OSS
        </SubBody>

        <Button
          margin="24px 0 24px 0"
          height="55px"
          onClick="/"
          bgColor="#5038bc10"
          color="#5038BC"
          _hover={{ background: "#5038bc1c" }}
          fontSize={{ base: "14px", md: "18px" }}
        >
          <img src={link} style={{ marginRight: "0.5rem" }}></img>
          https://ini-link-ristek-oss
        </Button>

        <DiscDesktop src={discordDesktop}></DiscDesktop>
        <DiscMobile src={discordMobile}></DiscMobile>

        <LinkBox alignItems="center">
          <a
            href="https://ristek.link/oss-discord"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              _hover={{ background: "primary.Purple" }}
              m={{ base: "0 0 1rem 0", md: "0 1rem 0 0" }}
              w="fit-content"
              h="57px"
            >
              Gabung Discord
            </Button>
          </a>
          <Link to="/kontributor">
            <Button variant="outline" w="fit-content" h="55px">
              Lihat kontributor
            </Button>
          </Link>
        </LinkBox>
      </FlexBox>
    </Box>
  );
}

export default Login;
