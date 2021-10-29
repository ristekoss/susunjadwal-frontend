import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { CalendarIcon, ViewListIcon } from "@heroicons/react/solid";
import { decodeHtmlEntity } from "utils/string";
import getFormattedSchedule from "utils/schedule";
import EditIcon from "assets/EditSchedule/EditIcon";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";
import ScheduleList from "containers/ViewSchedule/ScheduleList";
import Schedule from "containers/ViewSchedule/Schedule";
import Dropdown from "components/Dropdown";
const ScheduleDetail = ({
  schedule,
  idx,
  showModal,
  alertCopy,
  editSchedule,
}) => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const [isDisplayTimetable, setIsDisplayTimetable] = useState(true);

  const [formattedSchedule, totalCredits] = getFormattedSchedule(schedule);

  const convertDate = (date) => {
    const dateNew = new Date(date);
    return `${dateNew.getDate()}/${
      dateNew.getMonth() + 1
    }/${dateNew.getFullYear()}`;
  };

  return (
    <>
      <Card key={`${schedule.name}-${idx}`}>
        <div className="headerInfo">
          <div>
            <div style={{ display: "flex", gap: "13px" }}>
              <Link to={`/jadwal/${schedule.id}`}>
                <h2>
                  {schedule.name ? decodeHtmlEntity(schedule.name) : "Untitled"}
                </h2>
              </Link>
              <Dropdown
                DropdownItems={[
                  {
                    text: "Bagikan Jadwal",
                    icon: <ImageButton src={clipboardImg} />,
                    action: alertCopy,
                    copy: true,
                    scheduleId: schedule.id,
                  },

                  {
                    text: "Edit Jadwal",
                    icon: <EditIcon style={{ marginRight: "6px" }} />,
                    action: () => editSchedule(schedule.id),
                  },
                  {
                    text: "Delete Jadwal",
                    icon: <ImageButton src={deleteImg} />,
                    action: () => showModal(schedule.id),
                  },
                ]}
              ></Dropdown>
            </div>
            <h4>
              Dibuat pada {convertDate(schedule.created_at)} • {totalCredits}{" "}
              SKS
            </h4>
          </div>

          <CardActionContainer>
            <ViewToggleContainer>
              <ViewListContainer
                isActive={!isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(false)}
              >
                <ViewListIcon width={20} />
              </ViewListContainer>

              <ViewCalendarContainer
                isActive={isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(true)}
              >
                <CalendarIcon width={20} />
              </ViewCalendarContainer>
            </ViewToggleContainer>
          </CardActionContainer>
        </div>
        {isDisplayTimetable ? (
          <Schedule
            startHour={7}
            endHour={21}
            schedule={schedule}
            pxPerMinute={isMobile ? 0.3 : 0.7}
            width="100%"
            showRoom
          />
        ) : (
          <ScheduleList
            formattedSchedule={formattedSchedule}
            totalCredits={totalCredits}
          />
        )}
      </Card>
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

const ImageButton = styled.button`
  background: url(${({ src }) => src}) no-repeat;
  cursor: pointer;
  height: 24px;
  width: 24px;
  border: none;
  & + & {
    margin-left: 8px;
  }
`;

const ViewToggleContainer = styled.div`
  display: flex;
  margin-left: 5%;
  flex-direction: row;
  cursor: pointer;
  border-radius: 1em;
`;

const ViewListContainer = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.theme.color.primaryWhite};
  padding: 10px 1rem;
  border-top-left-radius: 1em;
  border-bottom-left-radius: 1em;
  border-left: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};
  svg {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
`;

const ViewCalendarContainer = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.theme.color.primaryWhite};
  padding: 10px 1rem;
  border-top-right-radius: 1em;
  border-bottom-right-radius: 1em;
  border-right: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};

  svg {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
`;

export default ScheduleDetail;
