import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import CourseClass from "./CourseClass";
function Course({ course }) {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");
  return (
    <div>
      <CourseTitle mode={theme}>
        {course.name}
        <span>
          ({course.credit}&nbsp;SKS,&nbsp;Term&nbsp;{course.term})
        </span>
      </CourseTitle>
      <CourseContainer>
        {!isMobile && (
          <Header mode={theme}>
            <div>Pilih</div>
            <div>Nama Kelas</div>
            <div>Waktu</div>
            <div>Ruang</div>
            <div>Pengajar</div>
          </Header>
        )}
        {course.classes.map((currentClass) => (
          <CourseClass
            key={currentClass.name}
            course={course}
            courseClass={currentClass}
          />
        ))}
      </CourseContainer>
    </div>
  );
}

const CourseContainer = styled.div`
  border: 1px solid ${(props) => props.theme.color.primaryMineShaft};
  box-sizing: border-box;
  margin-bottom: 24px;
  border-radius: 4px;
`;

const Header = styled.div`
  background-color : ${({ mode }) =>
    mode === "light"
      ? (props) => props.theme.color.primaryPurple
      : (props) => props.theme.color.darkLightPurple}
  color: ${(props) => props.theme.color.primaryWhite};
  font-weight: 600;
  display: flex;

  div {
    text-align: center;
    font-size: 16px;
    padding: 12px;

    &:nth-child(1) {
      flex: 1;
    }
    &:nth-child(2) {
      flex: 3;
    }
    &:nth-child(3) {
      flex: 3;
    }
    &:nth-child(4) {
      flex: 1;
    }
    &:nth-child(5) {
      flex: 4;
    }
  }
`;

const CourseTitle = styled.h2`
color: ${({ mode }) =>
  mode === "light"
    ? (props) => props.theme.color.primaryMineShaft
    : (props) => props.theme.color.darkWhite}
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 18px;

  align-items: center;
  display: flex;

  span {
    ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.primaryMineShaft
        : (props) => props.theme.color.darkWhite}
    font-weight: 600;
    margin-left: 7.5px;
    display: inline;
    font-size: 12px;
  }

  @media (min-width: 900px) {
    margin-bottom: 12px;
    font-size: 24px;

    span {
      font-size: 18px;
    }
  }
`;

export default Course;
