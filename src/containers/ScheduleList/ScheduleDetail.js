import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button, useColorModeValue } from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";
import ReactGA from "react-ga";

import Schedule from "containers/ViewSchedule/Schedule";
import Icons from "components/Icons";
import DownloadRef from "containers/ViewSchedule/DownloadRef";
import getFormattedSchedule from "utils/schedule";
import useDownloadCalendar from "hooks/useDownloadCalendar";
import { decodeHtmlEntity } from "utils/string";

import exportToIcsImg from "assets/ExportToIcs.svg";
import clipboardImg from "assets/Clipboard.svg";
import downloadImg from "assets/Download.svg";
import deleteImg from "assets/Delete.svg";

const ScheduleDetail = ({
  schedule,
  idx,
  showModal,
  editSchedule,
  showShareModal,
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

  return (
    <>
      <Link to={`/jadwal/${schedule.id}`}>
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

                <Button
                  mx="1rem"
                  intent="primary"
                  variant="outline"
                  onClick={() => editSchedule(schedule.id)}
                  display={isMobile ? "none" : "flex"}
                  borderColor={
                    theme === "light" ? "primary.Purple" : "dark.LightPurple"
                  }
                  color={theme === "light" ? "primary.Purple" : "dark.Purple"}
                >
                  Edit Jadwal
                </Button>
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
          <Schedule
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

export default ScheduleDetail;
