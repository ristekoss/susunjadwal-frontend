import React, { useEffect, useState } from "react";

import { Button, Box } from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getSchedules } from "services/api";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import { BauhausSide } from "components/Bauhaus";
import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";

import ScheduleDetail from "./ScheduleDetail";

const ScheduleList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    const fetchSchedules = async () => {
      dispatch(setLoading(true));
      const {
        data: { user_schedules },
      } = await makeAtLeastMs(getSchedules(auth.userId), 1000);
      setSchedules(user_schedules);
      dispatch(setLoading(false));
    };

    fetchSchedules();
  }, [dispatch, auth]);

  return (
    <Container>
      <Helmet
        title="Daftar Jadwal"
        meta={[{ name: "description", content: "Description of Jadwal" }]}
      />

      {schedules && schedules.length > 0 ? (
        <>
          <BauhausSide />
          <PageTitle mobile={isMobile}>Daftar Jadwal</PageTitle>
        </>
      ) : (
        ""
      )}

      {schedules && schedules.length > 0 ? (
        <CardContainer>
          {schedules.map((schedule, idx) => {
            return <ScheduleDetail schedule={schedule} idx={idx} />;
          })}
        </CardContainer>
      ) : (
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
          <Box pt="90px" mb={{ base: 16, md: "160px" }}>
            <div
              style={{ textAlign: isMobile ? "center" : "left", width: "100%" }}
            >
              <PageTitleNoSchedule mobile={isMobile}>
                Daftar Jadwal
              </PageTitleNoSchedule>
              <PageInfo mobile={isMobile}>
                Anda belum pernah membuat jadwal. Mulai susun jadwal anda
                sekarang!
              </PageInfo>
              <Link to={`/susun`}>
                <Button
                  height={{ base: "44px", md: "57px" }}
                  width={{ base: "137px", md: "194px" }}
                  ml={{ md: 12 }}
                  fontSize={{ base: "14px", md: "18px" }}
                >
                  Buat Jadwal
                </Button>
              </Link>
            </div>
          </Box>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-left: -3rem;
  margin-right: -3rem;
`;

const PageTitle = styled.h1`
  margin: ${({ mobile }) => (mobile ? "-40px 0 0 0px" : "0px 48px 30px 48px")};
  font-size: ${({ mobile }) => (mobile ? "1.7rem" : "2rem")};
  text-align: center;
  font-weight: bold;
  color: #5038bc;
  @media (min-width: 900px) {
    text-align: left;
  }
`;

const PageTitleNoSchedule = styled.h1`
  font-size: ${({ mobile }) => (mobile ? "50px" : "64px")};
  font-weight: bold;
  color: #5038bc;
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 16px 48px")};
`;

const PageInfo = styled.h2`
  font-size: ${({ mobile }) => (mobile ? "14px" : "18px")};
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 48px 48px")};
  color: #333333;
`;

const CardContainer = styled.div`
  padding: ${(props) => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  width: 100%;
  background-color: #ffffff;
`;

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  ${(props) =>
    props.isMobile &&
    `
    top: 50px;
    width: 100%;
    display: block;
    @media (min-width: 540px) {
      display: none;
    }
  `}
`;

export default ScheduleList;
