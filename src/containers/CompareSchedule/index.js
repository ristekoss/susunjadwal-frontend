import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Helmet from "react-helmet";
import {
  Button,
  Text,
  Flex,
  Box,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import Schedule from "./Schedule";
import CompareModal from "../ScheduleList/CompareModal";
import { getSchedule } from "services/api";
import { setLoading } from "redux/modules/appState";
import getFormattedSchedule from "utils/schedule";
import { makeAtLeastMs } from "utils/promise";
import { decodeHtmlEntity } from "utils/string";

import compareSchedule from "assets/compare-schedule.svg";

function CompareSchedule() {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");
  const dispatch = useDispatch();
  const location = useLocation();
  const compareModal = useDisclosure();

  const [schedule1, setSchedule1] = useState(null);
  const [schedule2, setSchedule2] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scheduleId1 = params.get("s1");
    const scheduleId2 = params.get("s2");

    async function fetchSchedules() {
      dispatch(setLoading(true));
      const [res1, res2] = await Promise.all([
        makeAtLeastMs(getSchedule(scheduleId1), 1000),
        makeAtLeastMs(getSchedule(scheduleId2), 1000),
      ]);

      const fetchedSchedule1 = res1.data.user_schedule;
      const fetchedSchedule2 = res2.data.user_schedule;

      setSchedule1(fetchedSchedule1);
      setSchedule2(fetchedSchedule2);

      dispatch(setLoading(false));
    }

    if (scheduleId1 && scheduleId2) {
      fetchSchedules();
    }
  }, [location.search, dispatch]);

  const [formattedSchedule1, totalCredits1] = schedule1
    ? getFormattedSchedule(schedule1)
    : [{}, 0];
  const [, totalCredits2] = schedule2
    ? getFormattedSchedule(schedule2)
    : [{}, 0];
  const createdAt1 = schedule1 ? new Date(schedule1.created_at) : null;

  return (
    <>
      <MainContainer>
        <Helmet
          title="Perbandingan Jadwal"
          meta={[{ name: "description", content: "Perbandingan Jadwal" }]}
        />

        {schedule1 && schedule2 && (
          <Container>
            <HeaderContainer>
              <div>
                <ScheduleName mode={theme}>
                  {decodeHtmlEntity(schedule1.name) || "Untitled"}
                </ScheduleName>
                <Text fontSize={{ base: "12px", md: "14px" }} mt="4px">
                  Dibuat pada{" "}
                  {createdAt1?.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  • {totalCredits1} SKS
                </Text>
              </div>
            </HeaderContainer>

            <ButtonContainer>
              <Flex alignItems="center">
                <Flex direction="column" mr={4}>
                  <Text>Jadwal Kamu</Text>
                  <Box bg="#5038BC" h="10px" borderRadius="4px" mt="4px" />
                </Flex>
                <Flex direction="column">
                  <Text>Jadwal Temanmu</Text>
                  <Box bg="#C424A3" h="10px" borderRadius="4px" mt="4px" />
                </Flex>
              </Flex>
              <Button
                variant="outline"
                borderColor={
                  theme === "light" ? "primary.Purple" : "dark.LightPurple"
                }
                color={theme === "light" ? "primary.Purple" : "dark.Purple"}
                onClick={compareModal.onOpen}
                ml={{ base: 0, md: 6 }}
                width={{ base: "100%", md: "auto" }}
              >
                Bandingkan Kembali
                <img
                  src={compareSchedule}
                  style={{ marginLeft: "6px", height: "25px" }}
                  alt="compare-schedule"
                />
              </Button>
            </ButtonContainer>
          </Container>
        )}

        <Schedule
          width="100%"
          pxPerMinute={isMobile ? 0.7 : 0.9}
          schedule1={schedule1}
          schedule2={schedule2}
          startHour={7}
          endHour={21}
          showHeader
          showLabel
          showRoom
        />
      </MainContainer>

      <CompareModal
        isOpen={compareModal.isOpen}
        onClose={compareModal.onClose}
        scheduleId={schedule1?.id}
      />
    </>
  );
}

const MainContainer = styled.div`
  padding: 0px !important;
  margin: -56px -24px 0;

  @media (min-width: 900px) {
    margin: -36px -80px 0;
  }
`;

const Container = styled.div`
  padding: 24px 24px 28px;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 32px 80px 40px;

    & > :nth-child(1) {
      flex-grow: 1;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
  justify-content: space-between;
  margin-right: -8px;

  @media (min-width: 900px) {
    margin-right: 0px;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 900px) {
    align-items: center;
    flex-direction: row;
    margin-top: 0px;
    margin-left: auto;
    justify-content: flex-end;
  }
`;

const ScheduleName = styled.div`
  font-size: 32px;
  color: ${(props) =>
    props.mode === "light"
      ? props.theme.color.secondaryMineShaft
      : props.theme.color.darkWhite};
`;

export default CompareSchedule;
