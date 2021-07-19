import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@chakra-ui/react";
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);

  const fetchCourses = useCallback(
    async majorId => {
      dispatch(setLoading(true));

      try {
        const { data } = await getCourses(majorId);
        setCourses(data.courses);
        setCoursesDetail(data.is_detail);
        setLastUpdated(new Date(data.last_update_at))
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

  return (
    <Container>
      <BauhausSide />
      <Helmet title="Buat Jadwal" />

      <CoursePickerContainer isMobile={isMobile}>
        <h1>Buat Jadwal</h1>

        {lastUpdated && (
          <h6>
            Jadwal terakhir diperbarui pada {isMobile ? <br/> : " "}
            <span>
              {lastUpdated?.getDate() + "/" + (lastUpdated?.getMonth() +1) + "/" +
              (lastUpdated?.getFullYear()) + " " + lastUpdated?.toLocaleTimeString()}
            </span>
          </h6>
        )}

        {!isCoursesDetail && (
          <InfoContent>
            <p>
              Uh oh, sepertinya kami belum memiliki jadwal untuk jurusan kamu. Silahkan
              coba untuk melakukan <span>Update Matkul</span> dengan menekan tombol di bawah ini!
            </p>
            <Link to="/update">
              <Button mt={{ base: "1rem", lg: "1.5rem" }}>Update Matkul</Button>
            </Link>
          </InfoContent>
        )}

        {courses?.length === 0 && (
          <InfoContent>
            <p>
              Uh oh, sepertinya jadwal jurusan kamu belum tersedia. Silahkan coba
              untuk melakukan <span>Update Matkul</span> lagi nanti!
            </p>
            <Link to="/update">
              <Button mt={{ base: "1rem", lg: "1.5rem" }}>Update Matkul</Button>
            </Link>
          </InfoContent>
        )}

        {courses &&
          courses.map((course, idx) => (
            <Course key={`${course.name}-${idx}`} course={course} />
          ))
        }
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

export const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.color.primaryWhite};
  color: ${props => props.theme.color.secondaryMineShaft};
  margin-top: -40px;

  @media (min-width: 900px) {
    margin-top: 8px;
  }
`;

export const InfoContent = styled.div`
  margin: 48px 0 16px;
  text-align: center;
  min-height: 100vh;
  font-size: 16px;

  p span {
    color: ${props => props.theme.color.primaryPurple};
    font-weight: 600;
  }

  @media (min-width: 900px) {
    margin-top: 24px;
    text-align: left;
    font-size: 18px;
    width: 80%;
  }
`;

export const CoursePickerContainer = styled.div`
  width: ${({ isMobile }) => (isMobile ? "100%" : "75%;")};
  color: #333333;

  h1 {
    color: ${props => props.theme.color.primaryPurple};
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }

  h6 {
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
  }

  h6 span {
    font-weight: 600;
  }

  @media (min-width: 900px) {
    h1 {
      font-size: 32px;
      text-align: left;
    }

    h6 {
      font-size: 16px;
      text-align: left;
    }
  }
`;

export const SelectedCoursesContainer = styled.div`
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