import { useSelector, useDispatch } from "react-redux";
import { Button, Box } from "@chakra-ui/react";
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

import {
  Header,
  LinkBox,
  LogoRistek,
  HeroSection,
  AssetChevron,
} from "./styles";

import {
  Title,
  FlexBox,
  TextBox,
  FlexItem,
  Paragraph,
  AssetBetaA,
  AssetBetaB,
} from "containers/BetaLanding/styles";


import RistekLogo from "assets/Beta/Beta_Logo.svg";
import ChevronArrow from "assets/Beta/chevron-down.svg";
import BetaAssetA from "assets/Beta/beta-landing-asset-1.svg";
import BetaAssetB from "assets/Beta/beta-landing-asset-2.svg";

function getServiceUrl() {
  return window.location.href.split("?")[0];
}

function Login({ history, location }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      <Bauhaus />

      <HeroSection>
        <LogoRistek src={RistekLogo} alt="ristek-logo" />
        <Header>
          Susun<span>Jadwal</span>
        </Header>
        <Announcement />
        <Button
          mt={{ base: "4rem", lg: "4.5rem" }}
          onClick={redirectToSSOLogin}
        >
          Masuk dengan SSO
        </Button>
        <a href="#content">
          <AssetChevron src={ChevronArrow} alt="chevron-down" />
        </a>
      </HeroSection>

      <FlexBox id="content" flexDir={{ base: "column-reverse", lg: "row" }}>
        <TextBox>
          <Title>Apa itu SusunJadwal?</Title>
          <Paragraph>
            SusunJadwal merupakan situs untuk membantu kamu menentukan jadwal
            kuliah yang akan kamu ambil dalam suatu semester. Dengan
            SusunJadwal, peluang kamu menang SIAK War akan lebih besar, loh!
          </Paragraph>
        </TextBox>
        <FlexItem display="flex" justifyContent="center">
          <AssetBetaA src={BetaAssetA} alt="beta-landing-asset-1" />
        </FlexItem>
      </FlexBox>

      <FlexBox
        flexDir={{ base: "column", lg: "row" }}
        mb={{ base: "6rem", lg: "10rem" }}
      >
        <FlexItem
          display="flex"
          justifyContent={{ base: "center", lg: "flex-start" }}
        >
          <AssetBetaB src={BetaAssetB} alt="beta-landing-asset-2" />
        </FlexItem>
        <TextBox>
          <Title>
            Bergabung dengan Komunitas SusunJadwal di Discord.{" "}
            <span>Soon!</span>
          </Title>
          <Paragraph>
            Bantu kami dengan menjadi kontributor untuk meningkatkan kualitas
            SusunJadwal. Dengan ini, kamu ikut berperan dalam membantu mahasiswa
            Universitas Indonesia!
          </Paragraph>
          <LinkBox>
            <Link
              href="https://discord.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button
                disabled
                _hover={{ background: 'primary.Purple' }}
                m={{ base: "0 0 1rem 0", lg: "0 1rem 0 0" }}
                w="fit-content"
              >
                Gabung Discord
              </Button>
            </Link>
            <Link to="/kontributor">
              <Button variant="outline" w="fit-content">
                Lihat kontributor
              </Button>
            </Link>
          </LinkBox>
        </TextBox>
      </FlexBox>
    </Box>
  );
}

export default Login;
