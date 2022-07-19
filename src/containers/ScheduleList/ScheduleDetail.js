import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { decodeHtmlEntity } from "utils/string";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";
import Schedule from "containers/ViewSchedule/Schedule";
import Icons from "components/Icons";
import downloadImg from "assets/Download.svg";
import { Button } from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";

const ScheduleDetail = ({
  schedule,
  idx,
  showModal,
  editSchedule,
  showShareModal,
}) => {
  const isMobile = useSelector((state) => state.appState.isMobile);

  const convertDate = (date) => {
    const dateNew = new Date(date);
    return `${dateNew.getDate()}/${
      dateNew.getMonth() + 1
    }/${dateNew.getFullYear()}`;
  };

  const refs = useRef(null);

  const downloadImage = async (name) => {
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
        <Card key={`${schedule.name}-${idx}`}>
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
                            schedule.name != null ? schedule.name : "Untitled",
                          ),
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
                >
                  Edit Jadwal
                </Button>
              </CardActionContainer>
            </Link>
          </div>
          <div style={{ overflow: "hidden", height: "0" }}>
            <div ref={refs}>
              <Schedule
                startHour={7}
                endHour={21}
                schedule={schedule}
                pxPerMinute={isMobile ? 0.7 : 0.9}
                width="100%"
                showRoom
                showHeader
                showLabel
              />
            </div>
          </div>
          <Schedule
            startHour={7}
            endHour={21}
            schedule={schedule}
            pxPerMinute={isMobile ? 0.3 : 0.7}
            width="100%"
            showRoom
          />
        </Card>
      </Link>
    </>
  );
};
const Card = styled.div`
  border: 0.05px solid #e5e5e5;
  border-radius: 8px;
  h2 {
    color: #333333;
    font-weight: bold;
    font-size: 18px;
  }
  h4 {
    color: #333333;
    font-size: 12px;
  }
  .headerInfo {
    padding: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #f5f5f5;
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
