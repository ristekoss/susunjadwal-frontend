import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { addSchedule, removeSchedule } from "redux/modules/schedules";

const CourseClassMobile = props => {
  return (
    <CouseClassMobileContainer onClick={props.handleChange}>
      <h2>{props.name}</h2>
      <h3>Pengajar</h3>
      {props.lecturer.map(lecturer => (
        <span key={lecturer}>- {lecturer}</span>
      ))}
      <h3>Jadwal</h3>
      {props.schedule_items.map((item, idx) => (
        <span key={idx}>
          - {item.day}, {item.start}-{item.end} ({item.room})
        </span>
      ))}
      <Radio active={props.isActive} />
    </CouseClassMobileContainer>
  );
};

const CourseClassDesktop = props => {
  const classSchedules = props.schedule_items.map((item, idx) => (
    <span key={idx}>
      - {item.day}, {item.start}-{item.end}
    </span>
  ));

  const rooms = props.schedule_items.map((item, idx) => (
    <span key={idx}>{item.room}</span>
  ));

  const lecturers = props.lecturer.map((lecturer, idx) => (
    <span key={idx}>- {lecturer}</span>
  ));

  return (
    <CourseClassContainer onClick={props.handleChange}>
      <CourseClassItem flex={1}>
        <Radio active={props.isActive} />
      </CourseClassItem>
      <CourseClassItem flex={3}>{props.name}</CourseClassItem>
      <CourseClassItem flex={3}>{classSchedules}</CourseClassItem>
      <CourseClassItem flex={1}>{rooms}</CourseClassItem>
      <CourseClassItem flex={4}>{lecturers}</CourseClassItem>
    </CourseClassContainer>
  );
};

function CourseClass({ course, courseClass }) {
  const key = `${course.name}-${courseClass.name}`;
  const isActive = useSelector(state => state.courses[key]);
  const isMobile = useSelector(state => state.appState.isMobile);
  const dispatch = useDispatch();

  const handleChange = () => {
    const item = {
      ...courseClass,
      credit: course.credit,
      parentName: course.name,
      term: course.term
    };

    if (isActive) {
      dispatch(removeSchedule(item));
    } else {
      dispatch(addSchedule(item));
    }
  };

  const Component = isMobile ? CourseClassMobile : CourseClassDesktop;
  const componentProps = { ...courseClass, handleChange, isActive };
  return <Component {...componentProps} />;
}

const CourseClassContainer = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: rgba(48, 128, 119, 0.1);
  }
`;

const CourseClassItem = styled.div`
  flex: ${({ flex }) => flex};
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

const Radio = styled.div`
  border: 1px solid #333333;
  height: 24px;
  width: 24px;

  &:before {
    content: "";
    display: block;
    background-color: ${({ active }) => (active ? "#F2994A" : "#0000")};
    margin: 4px;
    width: 14px;
    height: 14px;
  }
`;

const CouseClassMobileContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;

  h2 {
    font-size: 24px;
    margin: 0;
  }

  h3 {
    font-size: 18px;
    margin: 0;
    margin-top: 12px;
  }

  ${Radio} {
    position: absolute;
    right: 12px;
    top: 12px;
  }

  & + & {
    border-top: 1px solid #333333;
  }
`;
export default CourseClass;
