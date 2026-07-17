import React, { useRef } from "react";
import { useMixpanel } from "hooks/useMixpanel";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  Button,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";
import ReactGA from "react-ga";

import SchedulePreview from "./SchedulePreview";
import Icons from "components/Icons";
import DownloadRef from "containers/ViewSchedule/DownloadRef";
import getFormattedSchedule from "utils/schedule";
import useDownloadCalendar from "hooks/useDownloadCalendar";
import { decodeHtmlEntity } from "utils/string";

import exportToIcsImg from "assets/ExportToIcs.svg";
import clipboardImg from "assets/Clipboard.svg";
import downloadImg from "assets/Download.svg";
import deleteImg from "assets/Delete.svg";
import compareSchedule from "assets/compare-schedule.svg";
import compareBulb from "assets/compare-bulb.svg";
import compareMobile from "assets/compare-mobile.svg";

const ScheduleDetail = ({
  schedule,
  idx,
  showModal,
  editSchedule,
  showShareModal,
  showCompareModal,
}) => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");
  const { generateICalendarFile } = useDownloadCalendar(theme);
  let formattedSchedule = {};
  let totalCredits = 0;

  if (schedule) {
    [formattedSchedule, totalCredits] = getFormattedSchedule(schedule);
  }

  const convertDate = (date) => {
    const dateNew = new Date(date);
    return `${dateNew.getDate()}/${
      dateNew.getMonth() + 1
    }/${dateNew.getFullYear()}`;
  };

  const refs = useRef(null);

  const downloadImage = async (name) => {
    ReactGA.event({
      category: "Download Jadwal Image",
      action: "Downloaded a schedule's image",
    });

    const dataUrl = await htmlToImage.toPng(refs.current);
    const link = document.createElement("a");

    link.download = name + ".png";
    link.href = dataUrl;
    link.click();
  };

  const openShareModal = async (id, name) => {
    const dataUrl = await htmlToImage.toPng(refs.current);
    showShareModal(id, name, dataUrl);
  };

  const openCompareModal = () => {
    showCompareModal(schedule.id);
  };

  return (
    <>
      <Link
        onClick={() => useMixpanel.track("open_jadwal")}
        to={`/jadwal/${schedule.id}`}
      >
        <Card key={`${schedule.name}-${idx}`} mode={theme}>
          <div className="headerInfo">
            <div>
              <div
                style={{ display: "flex", gap: "13px", alignItems: "center" }}
              >
                <h2>
                  {schedule.name ? decodeHtmlEntity(schedule.name) : "Untitled"}
                </h2>
              </div>
              <h4>Dibuat pada {convertDate(schedule.created_at)}</h4>
            </div>

            <Link to={null} style={{ display: "flex" }}>
              <CardActionContainer>
                {isMobile ? (
                  <IconContainer>
                    <ImageButton
                      onClick={() =>
                        downloadImage(
                          !schedule.name ? "Untitled" : schedule.name,
                        )
                      }
                      data-hover="Download Jadwal"
                    >
                      <img src={downloadImg} alt="download" />
                    </ImageButton>

                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <div
                          style={{
                            marginLeft: "1rem",
                            cursor: "pointer",
                            color: "#5038BC",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            openCompareModal();
                          }}
                        >
                          <img src={compareMobile} alt="compare-schedule" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent width="250px">
                        <PopoverArrow bgColor="#5038BC" />
                        <PopoverBody
                          bg="#E1E5FE"
                          color="#5038BC"
                          border="2px"
                          borderColor="#5038BC"
                          borderRadius="8px"
                        >
                          <Flex alignItems="center">
                            <Image
                              src={compareBulb}
                              alt="compare-schedule"
                              boxSize="25px"
                              mr="10px"
                            />
                            <Text fontWeight="bold" fontSize="md">
                              Bandingkan jadwal dengan teman-mu!
                            </Text>
                          </Flex>
                          <Text mt="10px" fontWeight="medium" fontSize="sm">
                            Klik tombol share pada jadwal teman-mu, copy link
                            jadwal tersebut, lalu input linknya di sini! Kamu
                            bisa dengan mudah membandingkan jadwal dengan
                            teman-mu!
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>

                    <ImageButton
                      onClick={() => openShareModal(schedule.id, schedule.name)}
                      data-hover="Share Jadwal"
                    >
                      <img src={clipboardImg} alt="copy" />
                    </ImageButton>
                    <ImageButton
                      onClick={() => generateICalendarFile(schedule)}
                      data-hover="Ekspor ke .ics (Google Calendar/Apple Calendar)"
                    >
                      <img src={exportToIcsImg} alt="export-to-ics" />
                    </ImageButton>
                    <ImageButton
                      onClick={() => showModal(schedule.id)}
                      data-hover="Delete Jadwal"
                    >
                      <img src={deleteImg} alt="delete" />
                    </ImageButton>
                  </IconContainer>
                ) : (
                  <>
                    <IconContainer>
                      <Icons
                        Items={[
                          {
                            desc: "Download Jadwal",
                            icon: downloadImg,
                            alt: "download",
                            action: () =>
                              downloadImage(
                                !schedule.name ? "Untitled" : schedule.name,
                              ),
                          },
                          {
                            desc: "Ekspor ke .ics (Google Calendar/Apple Calendar)",
                            icon: exportToIcsImg,
                            alt: "export-to-ics",
                            action: () => generateICalendarFile(schedule),
                          },
                          {
                            desc: "Share Jadwal",
                            icon: clipboardImg,
                            alt: "copy",
                            action: () =>
                              openShareModal(schedule.id, schedule.name),
                          },
                          {
                            desc: "Delete Jadwal",
                            icon: deleteImg,
                            alt: "delete",
                            action: () => showModal(schedule.id),
                          },
                        ]}
                      />
                    </IconContainer>

                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <Button
                          mx="1rem"
                          intent="primary"
                          variant="outline"
                          borderColor={
                            theme === "light"
                              ? "primary.Purple"
                              : "dark.LightPurple"
                          }
                          color={
                            theme === "light" ? "primary.Purple" : "dark.Purple"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            openCompareModal();
                          }}
                        >
                          Bandingkan Jadwal
                          <img
                            src={compareSchedule}
                            style={{ marginLeft: "6px", height: "25px" }}
                            alt="compare-schedule"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent width="250px">
                        <PopoverArrow bgColor="#5038BC" />
                        <PopoverBody
                          bg="#E1E5FE"
                          color="#5038BC"
                          border="2px"
                          borderColor="#5038BC"
                          borderRadius="8px"
                        >
                          <Flex alignItems="center">
                            <Image
                              src={compareBulb}
                              alt="Compare Schedule"
                              boxSize="25px"
                              mr="10px"
                            />
                            <Text fontWeight="bold" fontSize="md">
                              Bandingkan jadwal dengan teman-mu!
                            </Text>
                          </Flex>
                          <Text mt="10px" fontWeight="medium" fontSize="sm">
                            Klik tombol share pada jadwal teman-mu, copy link
                            jadwal tersebut, lalu input linknya di sini! Kamu
                            bisa dengan mudah membandingkan jadwal dengan
                            teman-mu!
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                    <Button
                      mx="1rem"
                      intent="primary"
                      variant="outline"
                      onClick={() => editSchedule(schedule.id)}
                      borderColor={
                        theme === "light"
                          ? "primary.Purple"
                          : "dark.LightPurple"
                      }
                      color={
                        theme === "light" ? "primary.Purple" : "dark.Purple"
                      }
                    >
                      Edit Jadwal
                    </Button>
                  </>
                )}
              </CardActionContainer>
            </Link>
          </div>
          <div style={{ overflow: "hidden", minWidth: "1440px", height: "0" }}>
            <div ref={refs}>
              <DownloadRef
                pxPerMinute={0.9}
                schedule={schedule}
                startHour={7}
                endHour={21}
                showHeader
                showLabel
                showRoom
                formattedSchedule={formattedSchedule}
              />
            </div>
          </div>
          <SchedulePreview
            startHour={7}
            endHour={21}
            schedule={schedule}
            pxPerMinute={isMobile ? 0.7 : 0.9}
            width="100%"
            showRoom
          />
        </Card>
      </Link>
    </>
  );
};
const Card = styled.div`
  border: 0.05px solid ${({ mode }) =>
    mode === "light" ? "#e5e5e5" : "#363636"};
  border-radius: 8px;
  h2 {
    color:  ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineShaft
        : (props) => props.theme.color.darkWhite}
    font-weight: bold;
    font-size: 18px;
  }
  h4 {
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineShaft
        : (props) => props.theme.color.darkWhite}
    font-size: 12px;
  }
  .headerInfo {
    padding: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${({ mode }) =>
      mode === "light" ? "#f5f5f5" : "#333333"}
    border-radius: 8px 8px 0 0;
  }

  margin-bottom: 32px;
  @media (min-width: 900px) {
    h2 {
      font-size: 24px;
    }
    h4 {
      font-size: 14px;
    }
  }
`;

const CardActionContainer = styled.div`
  display: flex;
  flex-direction: "row";
  justify-content: center;
  align-items: center;
  .editIcon {
    margin-left: 8px;
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ImageButton = styled.div`
  justify-content: center;
  margin-left: 1rem;
  cursor: pointer;
  display: flex;
  position: relative;
  &:before,
  &:after {
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    position: absolute;
  }
  &:before {
    content: attr(data-hover);
    width: max-content;
    max-width: 210px;
    min-height: 32px;
    background-color: #4e4e4e;
    color: #ffffff;
    text-align: center;
    border-radius: 8px;
    padding: 6px;
    right: 0;
    top: 130%;
    font-size: 14px;
  }
  &:after {
    content: "";
    border-style: solid;
    border-color: #4e4e4e transparent;
    border-width: 0 8px 12px;
    top: 100%;
    right: 3px;
  }
  &:hover&:before,
  &:hover&:after {
    opacity: 1;
    visibility: visible;
  }
`;

export default ScheduleDetail;
