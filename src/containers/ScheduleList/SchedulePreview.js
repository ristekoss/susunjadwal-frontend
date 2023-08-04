import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import DetailsModal from "../ViewSchedule/DetailsModal";
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const pad = (val) => {
  return `0${val}`.substr(-2);
};

function Schedule({
  startHour,
  endHour,
  schedule,
  pxPerMinute,
  width,
  showLabel,
  showHeader,
  showRoom,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light");
  const rowToDisplay = (minute) => {
    const hour = Math.floor(minute / 60) + startHour;
    return `${pad(hour)}.${pad(minute % 60)}`;
  };

  const displayToMinute = (display) => {
    var [hour, minute] = display.split(".").map((part) => parseInt(part, 10));
    return (hour - startHour + 2) * 60 + minute - (showHeader ? 0 : 30);
  };

  const minuteToRow = (minute) => {
    return (minute + 1) * 60 - (showHeader ? 0 : 30);
  };

  const dayToColumn = (day) => DAYS.indexOf(day) + 1 + (showLabel ? 1 : 0);

  const TIME_MARKERS = Array(endHour - startHour + 1)
    .fill()
    .map((_, idx) => rowToDisplay(idx * 60));

  const renderHeader = () => (
    <>
      {showLabel && (
        <Header mode={theme}>
          <span>Jam</span>
        </Header>
      )}
      {DAYS.map((day) => (
        <Header mode={theme} key={day}>
          <span>{day}</span>
        </Header>
      ))}
    </>
  );

  const handleClickedCourse = (course) => {
    setSelectedCourse(course);
    onOpen();
  };

  return (
    <Container
      pxPerMinute={pxPerMinute}
      width={width}
      showLabel={showLabel}
      mode={theme}
    >
      <DetailsModal
        isOpen={isOpen}
        onClose={onClose}
        name={selectedCourse?.name}
        courseName={selectedCourse?.course_name}
        day={selectedCourse?.day}
        sks={selectedCourse?.sks}
        start={selectedCourse?.start}
        end={selectedCourse?.end}
        room={selectedCourse?.room}
        lecturer={selectedCourse?.lecturer.join(", ")}
      />

      {showHeader && renderHeader()}
      {TIME_MARKERS.map((_, idx) => (
        <TimeMarker
          key={idx}
          row={minuteToRow(idx)}
          showLabel={showLabel}
          mode={theme}
        />
      ))}
      {showLabel &&
        TIME_MARKERS.map((marker, idx) => (
          <TimeLabel key={idx} row={minuteToRow(idx)} mode={theme}>
            {marker}
          </TimeLabel>
        ))}
      {schedule &&
        schedule.schedule_items.map(
          ({ day, start, end, room, name, course_name }, idx) => (
            <ScheduleItem
              key={`${schedule.name}-${idx}`}
              start={displayToMinute(start)}
              end={displayToMinute(end)}
              day={dayToColumn(day)}
              mode={theme}
              onClick={() => handleClickedCourse(schedule.schedule_items[idx])}
            >
              {isMobile ? (
                <div className="wrapper">
                  {String(name).includes(course_name) || !course_name ? (
                    <p className="details-mobile">{name}</p>
                  ) : (
                    <p className="details-mobile">
                      <span
                        style={{
                          color: "#F7B500",
                          fontWeight: "bold",
                        }}
                      >
                        {name}
                      </span>
                      {" - " + course_name}
                    </p>
                  )}
                </div>
              ) : (
                // Desktop mode
                <>
                  {displayToMinute(end) - displayToMinute(start) >= 50 ? (
                    <div className="wrapper">
                      <div className="header">
                        <span>
                          {start} - {end}
                        </span>
                        {showRoom && <span className="room">{room}</span>}
                      </div>
                      {String(name).includes(course_name) || !course_name ? (
                        <p className="details-desktop">{name}</p>
                      ) : (
                        <p className="details-desktop">
                          <span
                            style={{
                              color: "#F7B500",
                              fontWeight: "bold",
                            }}
                          >
                            {name}
                          </span>
                          {" - " + course_name}
                        </p>
                      )}
                    </div>
                  ) : (
                    // Special condition for class with duration less than 50 minutes
                    <div className="wrapper">
                      {String(name).includes(course_name) || !course_name ? (
                        <p className="details-desktop">
                          <span style={{ fontWeight: "normal" }}>
                            {start} - {end}
                          </span>
                          {" - " + name}
                        </p>
                      ) : (
                        <p className="details-desktop">
                          <span style={{ fontWeight: "normal" }}>
                            {start} - {end}
                          </span>
                          {" - "}
                          <span
                            style={{
                              color: "#F7B500",
                              fontWeight: "bold",
                            }}
                          >
                            {name}
                          </span>
                          {" - " + course_name}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </ScheduleItem>
          ),
        )}
    </Container>
  );
}

const getContainerWidth = ({ showLabel }) => (showLabel ? "90%" : "100%");
const getFirstColumnWidth = ({ showLabel }) => (showLabel ? "auto" : "");

const Container = styled.div`
  display: grid;
  grid-template-columns: ${getFirstColumnWidth} repeat(
      6,
      calc(${getContainerWidth} / 6)
    );
  grid-template-rows: repeat(990, ${({ pxPerMinute }) => pxPerMinute}px);
  width: ${({ width }) => width};
  background-color:${({ mode }) => (mode === "light" ? "#FFFFFF" : "#292929")}
  border-radius: 0 0 8px 8px;
`;

const TimeLabel = styled.div`
  place-self: center;
  grid-area: ${({ row }) => row + 30} / 1 / ${({ row }) => row + 90} / 1;
  font-size: ${(props) => (props.theme.mobile ? "12px" : "16px")};
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#D0D0D0")};
`;

const TimeMarker = styled.div`
  grid-area: ${({ row }) => row} / ${({ showLabel }) =>
  showLabel ? "2" : "1"} /
    ${({ row }) => row + 60 + 1} / ${({ showLabel }) =>
  showLabel ? "8" : "7"};
  border: 0.95px solid ${({ mode }) =>
    mode === "light" ? "#E5E5E5" : "#363636"} 
  z-index: 0;
  padding-left: 30px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ mode }) => (mode === "light" ? "#5038bc" : "#674DE0")} 
  color: white;
  flex-direction: row;
  grid-row: 1 / 60;
  z-index: 2;

  font-size: ${(props) => (props.theme.mobile ? "12px" : "16px")};
`;

const ScheduleItem = styled.div`
z-index: 1;
width: 95%;
background-color: ${({ mode }) => (mode === "light" ? "#5038bc" : "#674DE0")} 
color: white;
grid-area: ${({ start }) => start} / ${({ day }) => day} / ${({ end }) => end} /
    ${({ day }) => day + 1};
border-radius: 8px;
cursor: pointer;
font-weight: 600;
margin-left: 8px;
margin-right: 8px;
  .wrapper {
    overflow: hidden;
    padding: 8px;
  }
  .details-mobile{
    font-size: 8px;
    overflow: hidden;
    // Condition based on start and end time
    --max-lines: ${({ end, start }) => {
      if (end - start >= 170) {
        return 11;
      } else if (end - start >= 100) {
        return 5;
      } else if (end - start >= 50) {
        return 2;
      } else {
        return 1;
      }
    }}
    --lh: 1.4;
    line-height: var(--lh);
    display: -webkit-box;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    font-weight: lighter;
    margin-bottom: 4px;
    .room {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 40%;
    }
  }

  .details-desktop{
    font-size: 12px;
    overflow: hidden;
    // Condition based on start and end time
    --max-lines: ${({ end, start }) => {
      if (end - start >= 100) {
        return 4;
      } else if (end - start >= 60) {
        return 2;
      } else {
        return 1;
      }
    }}
    --lh: 1.1;
    line-height: var(--lh);
    display: -webkit-box;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }
`;

export default Schedule;
