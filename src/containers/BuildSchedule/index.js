import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Helmet from "react-helmet";

import { getCourses } from "services/api";
import SelectedCourses from "containers/SelectedCourses";
import { setLoading } from "redux/modules/appState";
import { setCourses as reduxSetCourses } from "redux/modules/courses";

import Course from "./Course";
import Checkout from "./Checkout";
import Detail from "./Detail";

function BuildSchedule({ history }) {
  const auth = useSelector(state => state.auth);
  const isMobile = useSelector(state => state.appState.isMobile);
  const [detailData, setDetailData] = useState(null);

  const dispatch = useDispatch();

  const [courses, setCourses] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);

  const fetchCourses = useCallback(
    async majorId => {
      dispatch(setLoading(true));
      const { data } = await getCourses(majorId);
      setCourses(data.courses);
      setCoursesDetail(data.is_detail);
      dispatch(reduxSetCourses(data.courses));
      setTimeout(() => dispatch(setLoading(false)), 1000);
    },
    [dispatch]
  );

  useEffect(() => {
    const majorId = auth.majorId;
    fetchCourses(majorId);
  }, [auth, fetchCourses]);

  return (
    <Container>
      <Helmet title="Buat Jadwal" />
      <CoursePickerContainer isMobile={isMobile}>
        <h1>Buat Jadwal</h1>
        {!isCoursesDetail && (
          <InfoContent>
            Halo! Jadwal kamu belum detail nih, kalo kamu ingin membantu kami
            agar jadwal ini detail, kamu dapat mengubungi Ristek Fasilkom UI di
            LINE (@rye2953f). Terima kasih :D
          </InfoContent>
        )}
        {courses &&
          courses.map((course, idx) => (
            <Course key={`${course.name}-${idx}`} course={course} />
          ))}
      </CoursePickerContainer>
      {!isMobile && (
        <SelectedCoursesContainer>
          <SelectedCourses />
        </SelectedCoursesContainer>
      )}
      <Checkout
        isMobile={isMobile}
        onClickDetail={isConflict =>
          setDetailData({ opened: true, isConflict: isConflict })
        }
      />
      {detailData && detailData.opened && (
        <Detail
          closeDetail={() =>
            setDetailData({ opened: false, isConflict: detailData.isConflict })
          }
          isConflict={detailData && detailData.isConflict}
        />
      )}
    </Container>
  );
}

export default BuildSchedule;

const Container = styled.div`
  display: flex;
  background-color: #1a1a1a;
  color: white;
`;

const InfoContent = styled.div`
  margin-bottom: 16px;
`;

const CoursePickerContainer = styled.div`
  padding: ${({ isMobile }) =>
    isMobile ? "1rem 1rem 3rem 1rem" : "32px 48px"};
  width: ${({ isMobile }) => (isMobile ? "100%" : "75%;")};

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: white;
  }
`;

const SelectedCoursesContainer = styled.div`
  width: 25%;
  position: fixed;
  right: 0;
  padding: 48px 32px;
  background-color: #222222;
  height: calc(100vh - 64px);
  overflow-y: auto;
`;
