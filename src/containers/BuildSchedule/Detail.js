import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";

import SelectedCourses from "containers/SelectedCourses";
import Schedule from "containers/ViewSchedule/Schedule";
import backImg from "assets/Back.svg";

const HideBodyOverflow = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

function transformSchedules(schedules) {
  return schedules
    .map(schedule =>
      schedule.schedule_items.map(item => ({
        ...item,
        name: schedule.name
      }))
    )
    .reduce((prev, now) => [...prev, ...now], []);
}

function Detail({ closeDetail, isConflict, isEditing = false, scheduleId }) {
  const schedules = useSelector(state => state.schedules);

  function performCloseDetail() {
    closeDetail();
  }

  return (
    <Container>
      <ImageButton src={backImg} onClick={performCloseDetail} />
      <HideBodyOverflow />
      {console.log(isConflict)}
      {!isConflict && (
        <Schedule
          schedule={{ schedule_items: transformSchedules(schedules) }}
          pxPerMinute={0.3}
          width="100%"
          startHour={7}
          endHour={21}
        />
      )}
      <SelectedCourses isEditing={isEditing} scheduleId={scheduleId} />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #222;
  z-index: 322;
  padding: 1rem;
  overflow: auto;
`;

const ImageButton = styled.button`
  background: url(${({ src }) => src}) no-repeat;
  cursor: pointer;
  height: 24px;
  width: 24px;
  border: none;
`;

export default Detail;
