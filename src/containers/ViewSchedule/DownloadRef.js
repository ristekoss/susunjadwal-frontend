import React from "react";
import styled from "styled-components";
import { useColorModeValue } from "@chakra-ui/react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const pad = (val) => {
  return `0${val}`.substr(-2);
};

function DownloadRef({
  startHour,
  endHour,
  schedule,
  pxPerMinute,
  width,
  showLabel,
  showHeader,
  showRoom,
  formattedSchedule,
}) {
  const theme = useColorModeValue("light", "dark");
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

  return (
    <MainContainer>
      {/* Calendar View */}
      <Container
        pxPerMinute={pxPerMinute}
        width={width}
        showLabel={showLabel}
        mode={theme}
      >
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
              >
                {/* Desktop mode */}
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
                          <span style={{ fontWeight: "normal" }}>{room}</span>
                          {" - " + name}
                        </p>
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
                  )}
                </>
              </ScheduleItem>
            ),
          )}
      </Container>

      {/* List View */}
      <ClassTableContainer mode={theme}>
        <ClassHeaderContainer mode={theme}>
          <div>Nama Kelas</div>
          <div>Waktu</div>
          <div>Ruang</div>
          <div>Dosen</div>
          <div>SKS</div>
        </ClassHeaderContainer>

        {Object.keys(formattedSchedule).map((scheduleName) => (
          <ClassItemContainer mode={theme}>
            <div>{formattedSchedule[scheduleName].name}</div>
            <div>
              {formattedSchedule[scheduleName].time.map((dayItem) => (
                <div>{`${dayItem.day}, ${dayItem.start} - ${dayItem.end}`}</div>
              ))}
            </div>
            <div>
              {formattedSchedule[scheduleName].time.map((dayItem) => (
                <div>{dayItem.room}</div>
              ))}
            </div>
            <div>{formattedSchedule[scheduleName].lecturer}</div>
            <div>{formattedSchedule[scheduleName].sks}</div>
          </ClassItemContainer>
        ))}
      </ClassTableContainer>
    </MainContainer>
  );
}

const getContainerWidth = ({ showLabel }) => (showLabel ? "90%" : "100%");
const getFirstColumnWidth = ({ showLabel }) => (showLabel ? "auto" : "");

const MainContainer = styled.div`
  display: block;
  min-width: 1440px;
`;

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
  font-size: 16px;
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

  font-size: 16px;
  font-weight: 600;
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

const ClassHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  background-color: ${(props) =>
    props.mode === "light"
      ? props.theme.color.primaryPurple
      : props.theme.color.darkLightPurple};
  color: ${(props) => props.theme.color.primaryWhite};

  padding-top: 0.25em;
  padding-bottom: 0.25em;
  font-size: 1rem;
  font-weight: 600;
  height: 52.5px;

  div {
    flex: 1;
    text-align: center;
  }

  }
`;

const ClassItemContainer = styled.tr`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => (props.mode === "light" ? "black" : "#D0D0D0")};
  border-top: 1.5px solid ${(props) => props.theme.color.secondaryMineShaft};
  div {
    flex: 1;
    text-align: center;
    font-size: 1rem;
    padding: 8px;
  }
`;

const ClassTableContainer = styled.div`
  border-top: 1px solid
    ${(props) =>
      props.mode === "light"
        ? props.theme.color.primaryMineShaft
        : props.theme.color.darkBlack};
  border-bottom: 1px solid
    ${(props) =>
      props.mode === "light"
        ? props.theme.color.primaryMineShaft
        : props.theme.color.darkBlack};
  box-sizing: border-box;
  margin-bottom: 24px;

  hyphens: auto;

  tr:nth-child(even) {
    background: ${(props) =>
      props.mode === "light"
        ? props.theme.color.primaryAlabaster
        : props.theme.color.darkLightBlack};
  }
  tr:nth-child(odd) {
    background: ${(props) =>
      props.mode === "light"
        ? props.theme.color.primaryWhite
        : props.theme.color.darkLightBlack};
  }
`;

export default DownloadRef;
