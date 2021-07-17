import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { addSchedule, removeSchedule } from "redux/modules/schedules";

import checkmark from 'assets/Beta/checkmark.svg';

const CourseClassMobile = props => {
  return (
    <CouseClassMobileContainer onClick={props.handleChange}>
      <h2>{props.name}</h2>
      <h3>Pengajar</h3>
      <ul>
        {props.lecturer.map(lecturer => (
          <li key={lecturer}>{lecturer}</li>
        ))}
      </ul>
      <h3>Jadwal</h3>
      <ul>
        {props.schedule_items.map((item, idx) => (
          <li key={idx}>
            {item.day}, {item.start}-{item.end} ({item.room})
          </li>
        ))}
      </ul>
      <Radio active={props.isActive} />
    </CouseClassMobileContainer>
  );
};

const CourseClassDesktop = props => {
  const classSchedules = props.schedule_items.map((item, idx) => (
    <li key={idx}>
      {item.day}, {item.start}-{item.end}
    </li>
  ));

  const rooms = props.schedule_items.map((item, idx) => (
    <span key={idx}>{item.room}</span>
  ));

  const lecturers = props.lecturer.map((lecturer, idx) => (
    <li key={idx}>{lecturer}</li>
  ));

  return (
    <CourseClassContainer onClick={props.handleChange}>
      <CourseClassItem flex={1}>
        <Radio active={props.isActive} />
      </CourseClassItem>
      <CourseClassItem flex={3}>{props.name}</CourseClassItem>
      <CourseClassItem flex={3}><ul>{classSchedules}</ul></CourseClassItem>
      <CourseClassItem flex={1}>{rooms}</CourseClassItem>
      <CourseClassItem flex={4}><ul>{lecturers}</ul></CourseClassItem>
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
  color: #333333;
  cursor: pointer;

  &:hover {
    background-color: #ffffff;
  }
`;

const CourseClassItem = styled.div`
  flex: ${({ flex }) => flex};
  padding: 12px;
  display: flex;
  flex-direction: column;

  text-align: center;

  ul {
    margin-left: 15%;
    text-align: left;
  }

  li {
    list-style-type: none;
    position: relative;
  }

  li::before {
    content: '•';
    position: absolute;
    left: -12px;
    font-size: 16px;
  }
`;

const Radio = styled.div`
  border: 1.5px solid #828282;
  border-radius: 4px;
  position: relative;
  height: 24px;
  width: 24px;

  border: ${({ active }) => (
    !active
      ? '1.5px solid #828282'
      : 'none'
  )};

  background-color: ${({ active }) => (
    active
      ? props => props.theme.color.primaryPurple
      : props => props.theme.color.primaryWhite
  )};

  &:before {
    content: url(${checkmark});
    border-radius: 4px;
    position: absolute;

    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: 3px;
    width: 100%;
    height: 100%;
  }
`;

const CouseClassMobileContainer = styled.div`
  flex-direction: column;
  position: relative;
  display: flex;
  padding: 12px;

  h2 {
    color: ${props => props.theme.color.secondaryMineShaft};
    font-weight: 600;
    font-size: 18px;
    margin: 0 0 4px 0;
  }

  h3 {
    margin: 12px 0 0 0;
    font-size: 14px;
  }

  ${Radio} {
    position: absolute;
    right: 12px;
    top: 12px;
  }

  & + & {
    border-top: 1px solid #333333;
  }

  ul {
    margin-left: 16px;
    font-size: 14px;
  }

  li {
    list-style-type: none;
    position: relative;
  }

  li::before {
    content: '•';
    position: absolute;
    left: -12px;
    font-size: 16px;
  }
`;
export default CourseClass;
