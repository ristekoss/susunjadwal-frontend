import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Helmet from "react-helmet";

import { setCourses as reduxSetCourses } from "redux/modules/courses";
import { clearSchedule } from "redux/modules/schedules";
import { setLoading } from "redux/modules/appState";
import { getCourses } from "services/api";

import SelectedCourses from "containers/SelectedCourses";
import { BauhausSide } from "components/Bauhaus";
import Checkout from "./Checkout";
import Course from "./Course";
import Detail from "./Detail";

function BuildSchedule() {
  const auth = useSelector(state => state.auth);
  const isMobile = useSelector(state => state.appState.isMobile);
  const [detailData, setDetailData] = useState(null);

  const dispatch = useDispatch();

  const [courses, setCourses] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);

  const fetchCourses = useCallback(
    async majorId => {
      dispatch(setLoading(true));

      try {
        const { data } = await getCourses(majorId);
        setCourses(data.courses);
        setCoursesDetail(data.is_detail);
        dispatch(reduxSetCourses(data.courses));
      } catch(e) {/** TODO: handle error */}

      setTimeout(() => dispatch(setLoading(false)), 1000);
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(clearSchedule());
    const majorId = auth.majorId;
    fetchCourses(majorId);
  }, [auth.majorId, dispatch, fetchCourses]);

  useEffect(() => {
    console.log(courses)
  }, [courses])

  return (
    <Container>
      <BauhausSide />
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
        {courses?.length === 0 && (
          <InfoContent>
            Jadwal kosong gara-gara password salah, tunggu 5 menit lagi
            <Link to="/sso/login"> disini</Link>
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
  background-color: ${props => props.theme.color.primaryWhite};
  color: ${props => props.theme.color.secondaryMineShaft};
  margin-top: -40px;

  @media (min-width: 900px) {
    margin-top: 8px;
  }
`;

const InfoContent = styled.div`
  margin-bottom: 16px;
  min-height: 100vh;
`;

const CoursePickerContainer = styled.div`
  width: ${({ isMobile }) => (isMobile ? "100%" : "75%;")};
  color: #333333;

  h1 {
    color: ${props => props.theme.color.primaryPurple};
    margin-bottom: 16px;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }

  @media (min-width: 900px) {
    h1 {
      font-size: 32px;
      text-align: left;
    }
  }
`;

const SelectedCoursesContainer = styled.div`
  background-color: ${props => props.theme.color.primaryWhite};
  height: 100vh;
  padding: 128px 32px;
  overflow-y: auto;
  position: fixed;
  width: 25%;
  right: 0;
  top: 0;

  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
`;
