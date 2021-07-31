import React from "react";
import styled from "styled-components";

const ScheduleList = ({ schedule }) => {
  if (schedule) {
    const formattedSchedule = {};
    schedule.schedule_items.forEach(({name, start, end, day, room, course_name}) => {
      const scheduleKey =  `${course_name}-${name}`;
      const formatedName = (String(name).includes(course_name) || !course_name) ? name : `${course_name} - ${name}`
      if (!(scheduleKey in formattedSchedule)) {
        formattedSchedule[scheduleKey] = {
          name: formatedName,
          time: [
            {
              start: start,
              end: end,
              day: day,
              room: room,
            },
          ],
        };
      } else {
        formattedSchedule[scheduleKey].time.push({
          start: start,
          end: end,
          day: day,
          room: room,
        });
      }
    });
    return (
      <ClassTableContainer>
        <ClassHeaderContainer>
          <div>Nama Kelas</div>
          <div>Waktu</div>
          <div>Ruang</div>
        </ClassHeaderContainer>
        {Object.keys(formattedSchedule).map((scheduleName) => (
          <ClassItemContainer>
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
          </ClassItemContainer>
        ))}
      </ClassTableContainer>
    );
  } else {
    return <div>Loading...</div>;
  }
};

const ClassHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  background-color: ${(props) => props.theme.color.primaryPurple};
  color: ${(props) => props.theme.color.primaryWhite};

  height: 40.56px;
  font-size: 0.75rem;
  padding-top: 0.25em;
  padding-bottom: 0.25em;

  div {
    flex: 1;
    text-align: center;
  }

  @media (min-width: 900px) {
    font-size: 1rem;
    height: 52.5px;
  }
`;

const ClassItemContainer = styled.tr`
  display: flex;
  flex-direction: row;
  align-items: center;

  div {
    flex: 1;
    font-size: 0.75rem;
    text-align: center;
    padding: 8px 8px;
  }

  @media (min-width: 900px) {
    div {
      font-size: 1rem;
    }
  }
`;

const ClassTableContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme.color.primaryMineShaft};
  border-bottom: 1px solid ${(props) => props.theme.color.primaryMineShaft};
  box-sizing: border-box;
  margin-bottom: 24px;

  tr:nth-child(even) {
    background: ${(props) => props.theme.color.primaryAlabaster};
  }
  tr:nth-child(odd) {
    background: ${(props) => props.theme.color.primaryWhite};
  }
`;

export default ScheduleList;
