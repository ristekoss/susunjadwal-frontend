import { useSelector, useDispatch } from "react-redux";
import { Fade, Button, Box, useColorModeValue } from "@chakra-ui/react";
import { useMixpanel } from "hooks/useMixpanel";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { parse } from "query-string";
import CountUp from "react-countup";

import { persistAuth, persistCompletion } from "utils/auth";
import { setLoading } from "redux/modules/appState";
import { redirectToSSOLogin } from "services/sso";
import { makeAtLeastMs } from "utils/promise";
import { postAuthTicket } from "services/api";
import { setAuth } from "redux/modules/auth";

import { Illustration } from "components/Illustration";
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
  AssetChevronDown,
  AssetChevronUp,
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
  DiscordButton,
} from "./styles";

import { FlexBox } from "containers/BetaLanding/styles";

import RistekLogo from "assets/Logo/RistekLogo-light-2025.svg";
import ChevronDown from "assets/Beta/chevron-down.svg";
import ChevronUp from "assets/Beta/chevron-up.svg";

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

  // ScrollToTop

  const [Visible, setVisible] = useState(false);
  const [Stick, setToStick] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const listenToScroll = () => {
    let showLimit = 800;
    let stickLimit = 1470;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > showLimit) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    if (winScroll > stickLimit) {
      setToStick(true);
    } else {
      setToStick(false);
    }
  };

  // Number Counting Animation

  const userNumber = useRef(null);
  const jadwalNumber = useRef(null);

  const [userCountLocked, userCountLock] = useState(false);
  const [jadwalCountLocked, jadwalCountLock] = useState(false);

  function useIsInViewport(ref, source) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
      () =>
        new IntersectionObserver(([entry]) =>
          setIsIntersecting(entry.isIntersecting),
        ),
      [],
    );

    useEffect(() => {
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }, [ref, observer]);

    useEffect(() => {
      if (isIntersecting & (source === "user")) {
        userCountLock(true);
      }

      if (isIntersecting & (source === "jadwal")) {
        jadwalCountLock(true);
      }
    }, [isIntersecting, source]);

    return isIntersecting;
  }

  return (
    <Box px={{ base: "0px", lg: "40px" }}>
      <Illustration />

      <HeroSection>
        <LogoRistek src={RistekLogo} alt="ristek-logo" />

        <Header>
          Susun<span>Jadwal</span>
        </Header>

        <Description>
          Kamu pernah merasa frustrasi karena kalah SIAKWAR?
          <div style={{ height: "12px" }}></div>
          Gausah takut lagi!
          <span> Susun</span>
          <span style={{ color: "#5038BC" }}>Jadwal </span>
          by RISTEK hadir buat kamu yang mau merencanakan kelas semester depan
          dengan mudah!
          <div style={{ height: "12px" }}></div>
          Dengan SusunJadwal, peluang kamu menang SIAKWAR akan lebih besar!
        </Description>

        <Announcement />

        <CTAButtonDesktop height="55px" onClick={redirectToSSOLogin}>
          <img src={makara} style={{ marginRight: "0.5rem" }}></img>
          Rencanakan SIAKWAR Sekarang
        </CTAButtonDesktop>

        <CTAButtonMobile
          height={{ base: "44px", md: "55px" }}
          width="319px"
          onClick={redirectToSSOLogin}
        >
          <img src={makara} style={{ marginRight: "0.5rem" }}></img>
          Masuk Dengan SSO
        </CTAButtonMobile>

        <a href="#content">
          <AssetChevronDown src={ChevronDown} alt="chevron-down" />
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
                borderRadius: "0 0 51px 51px",
                backgroundColor: "#FFFFFF",
                padding: "0 40px 40px 40px",
                margin: "5px",
                pointerEvents: "none",
              }}
            >
              <Number ref={userNumber}>
                {userCountLocked | useIsInViewport(userNumber, "user") ? (
                  <CountUp end={10000} separator="." suffix="++" />
                ) : (
                  "0++"
                )}
              </Number>
              <NumberDesc>
                SusunJadwal by RISTEK telah dipercaya oleh lebih dari 10.000
                mahasiswa Universitas Indonesia yang berhasil merencanakan
                jadwal kuliah mereka dengan sukses.
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
                borderRadius: "0 0 51px 51px",
                backgroundColor: "#FFFFFF",
                padding: "0 40px 40px 40px",
                margin: "5px",
                pointerEvents: "none",
              }}
            >
              <Number ref={jadwalNumber}>
                {jadwalCountLocked | useIsInViewport(jadwalNumber, "jadwal") ? (
                  <CountUp end={26000} separator="." suffix="++" />
                ) : (
                  "0++"
                )}
              </Number>
              <NumberDesc>
                SusunJadwal by RISTEK telah berhasil menciptakan lebih dari
                26.000 jadwal kuliah untuk menghadapi SIAKWAR di mana pengguna
                dapat membuat berbagai skema jadwal.
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

        <a
          href="https://github.com/ristekoss"
          style={{ margin: "24px 0 24px 0" }}
        >
          <Button
            height={{ base: "44px", md: "55px" }}
            bgColor="#5038bc10"
            color="#5038BC"
            _hover={{ background: "#5038bc1c" }}
            _active={{ background: "#5038bc2c" }}
            fontSize={{ base: "14px", md: "18px" }}
          >
            <img src={link} style={{ marginRight: "0.5rem" }}></img>
            https://github.com/ristekoss
          </Button>
        </a>

        <DiscDesktop src={discordDesktop}></DiscDesktop>
        <DiscMobile src={discordMobile}></DiscMobile>

        <LinkBox alignItems="center">
          <a
            href="https://ristek.link/oss-discord"
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => useMixpanel.track("gabung_discord")}
          >
            <DiscordButton _hover={{ background: "primary.Purple" }}>
              Join Discord
            </DiscordButton>
          </a>
          <div style={{ minWidth: "16px", minHeight: "16px" }}></div>
          <Link
            to="/kontributor"
            onClick={() => useMixpanel.track("see_contributor_detail")}
          >
            <DiscordButton variant="outline">Lihat Kontributor</DiscordButton>
          </Link>
        </LinkBox>
      </FlexBox>

      <Fade in={Visible}>
        <a href="#">
          <AssetChevronUp
            src={ChevronUp}
            alt="chevron-up"
            style={{
              position: Stick ? "absolute" : "fixed",
              bottom: Stick ? "380px" : "120px",
            }}
          />
        </a>
      </Fade>
    </Box>
  );
}

export default Login;
