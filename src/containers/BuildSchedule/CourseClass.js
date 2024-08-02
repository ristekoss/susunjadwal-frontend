import React from "react";
import styled from "styled-components";
// import { useMixpanel } from "hooks/useMixpanel";
import { useSelector, useDispatch } from "react-redux";
import { addSchedule, removeSchedule } from "redux/modules/schedules";
import { useColorModeValue } from "@chakra-ui/react";
import checkmark from "assets/Beta/checkmark.svg";

const CourseClassMobile = (props) => {
  const theme = useColorModeValue("light", "dark");
  return (
    <CouseClassMobileContainer onClick={props.handleChange} mode={theme}>
      <h2>{props.name}</h2>
      <h3>Pengajar</h3>
      <ul>
        {props.lecturer[0] === "" ? (
          <span>Pengajar belum tersedia</span>
        ) : (
          props.lecturer.map((lecturer) => <li key={lecturer}>{lecturer}</li>)
        )}
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

const CourseClassDesktop = (props) => {
  const theme = useColorModeValue("light", "dark");
  const classSchedules = props.schedule_items.map((item, idx) => (
    <li key={idx}>
      {item.day}, {item.start}-{item.end}
    </li>
  ));

  const rooms = props.schedule_items.map((item, idx) => (
    <span key={idx}>{item.room}</span>
  ));

  const lecturers = () => {
    return (
      <>
        {props.lecturer[0] === "" ? (
          <span
            style={{
              display: "block",
              textAlign: "center",
              paddingRight: "15%",
            }}
          >
            –
          </span>
        ) : (
          props.lecturer.map((lecturer, idx) => <li key={idx}>{lecturer}</li>)
        )}
      </>
    );
  };

  return (
    <CourseClassContainer onClick={props.handleChange} mode={theme}>
      <CourseClassItem flex={1}>
        <Radio active={props.isActive} />
      </CourseClassItem>
      <CourseClassItem flex={3}>{props.name}</CourseClassItem>
      <CourseClassItem flex={3}>
        <ul>{classSchedules}</ul>
      </CourseClassItem>
      <CourseClassItem flex={1}>{rooms}</CourseClassItem>
      <CourseClassItem flex={4}>
        <ul>{lecturers()}</ul>
      </CourseClassItem>
    </CourseClassContainer>
  );
};

function CourseClass({ course, courseClass }) {
  const key = `${course.name}-${courseClass.name}-${course.term}-${courseClass.schedule_items[0].room}`;

  const isActive = useSelector((state) => state.courses[key]);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const dispatch = useDispatch();

  const handleChange = () => {
    const item = {
      ...courseClass,
      credit: course.credit,
      parentName: course.name,
      term: course.term,
    };

    if (isActive) {
      dispatch(removeSchedule(item));
    } else {
      dispatch(addSchedule(item));
      // TODO: Re-enable mixpanel or change to other analytics
      // useMixpanel.track("select_course");
    }
  };

  const Component = isMobile ? CourseClassMobile : CourseClassDesktop;
  const componentProps = { ...courseClass, handleChange, isActive };
  return <Component {...componentProps} />;
}

const CourseClassContainer = styled.div`
background-color:${({ mode }) =>
  mode === "light"
    ? (props) => props.theme.color.primaryWhite
    : (props) => props.theme.color.darkLightBlack}
  display: flex;
  flex-direction: row;
  color: ${({ mode }) =>
    mode === "light"
      ? (props) => props.theme.color.secondaryMineShaft
      : (props) => props.theme.color.darkWhite}
  cursor: pointer;
  border-top: 1px solid ${(props) => props.theme.color.secondaryMineShaft};
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
    content: "•";
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

  border: ${({ active }) => (!active ? "1.5px solid #828282" : "none")};

  background-color: ${({ active }) =>
    active
      ? (props) => props.theme.color.primaryPurple
      : (props) => props.theme.color.primaryWhite};

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
  background-color:${({ mode }) =>
    mode === "light"
      ? (props) => props.theme.color.primaryWhite
      : (props) => props.theme.color.darkLightBlack}
  flex-direction: column;
  position: relative;
  display: flex;
  padding: 12px;

  h2 {
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineShaft
        : (props) => props.theme.color.darkWhite}
    font-weight: 600;
    font-size: 18px;
    margin: 0 0 4px 0;
  }

  h3 {
    margin: 12px 0 0 0;
    font-size: 14px;
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineShaft
        : (props) => props.theme.color.darkWhite}
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
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineShaft
        : (props) => props.theme.color.darkWhite}
  }

  li {
    list-style-type: none;
    position: relative;
  }

  li::before {
    content: "•";
    position: absolute;
    left: -12px;
    font-size: 16px;
  }
`;
export default CourseClass;
