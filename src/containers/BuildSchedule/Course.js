import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import CourseClass from "./CourseClass";
function Course({ course }) {
  const isMobile = useSelector(state => state.appState.isMobile);

  return (
    <div>
      <CourseTitle>
        {course.name}
        <span>
          {" "}
          ({course.credit}&nbsp;SKS,&nbsp;Term&nbsp;{course.term})
        </span>
      </CourseTitle>
      <CourseContainer>
        {!isMobile && (
          <Header>
            <div>Pilih</div>
            <div>Nama Kelas</div>
            <div>Waktu</div>
            <div>Ruang</div>
            <div>Pengajar</div>
          </Header>
        )}
        {course.classes.map(currentClass => (
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
  border: 1px solid #333333;
  margin-bottom: 32px;
`;

const Header = styled.div`
  background-color: #333333;
  font-family: Avenir;
  font-weight: 400;
  color: white;
  display: flex;

  div {
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
  font-size: 1.5rem;
  color: #F2994A;
  font-weight: bold;


  span {
    display: inline;
    // ${({ isMobile }) => isMobile && `margin-left: 0.5rem;`}

    color: white;
    font-weight: 400;
    font-size: 1rem;
  }
`;

export default Course;
