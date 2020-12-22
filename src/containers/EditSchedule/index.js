import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import styled from "styled-components";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import { setCourses as reduxSetCourses } from "redux/modules/courses";

import Course from '../BuildSchedule/Course';
import Checkout from '../BuildSchedule/Checkout';
import Detail from '../BuildSchedule/Detail';

import { getSchedule, getCourses } from 'services/api';
import { addSchedule, clearSchedule } from 'redux/modules/schedules';
import { generateScheduledCourseListFromSchedule } from './utils';
import SelectedCourses from 'containers/SelectedCourses';


const EditSchedule = ({ match }) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { isMobile } = useSelector(state => state.appState)
    const { scheduleId } = useParams();
    const [courses, setCourses] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [isCoursesDetail, setCoursesDetail] = useState(null);

    useEffect(() => {
        async function fetchSchedule() {
            dispatch(setLoading(true));
            const {
                data: { user_schedule }
            } = await makeAtLeastMs(getSchedule(match.params.scheduleId), 1000);
            const formattedSchedule = await generateScheduledCourseListFromSchedule(auth.majorId, user_schedule);
            formattedSchedule.forEach(schd => {
                dispatch(addSchedule(schd));
            })
            dispatch(setLoading(false));
        }
        if (!!courses) {
            fetchSchedule();
        }
    }, [match, dispatch, courses, auth.majorId]);


    const fetchCourses = useCallback(
        async majorId => {
            dispatch(setLoading(true));
            const { data } = await getCourses(majorId);
            setCourses(data.courses);
            setCoursesDetail(data.is_detail);
            dispatch(reduxSetCourses(data.courses));
            setTimeout(() => dispatch(setLoading(false)), 2000);
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(clearSchedule());
        const majorId = auth.majorId;
        fetchCourses(majorId);
    }, [auth.majorId, dispatch, fetchCourses]);






    return (
        <Fragment>
            <Helmet title="Edit Jadwal" />
            <Container>
                <CoursePickerContainer isMobile={isMobile}>
                    <h1>Edit Jadwal</h1>
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
                        <SelectedCourses scheduleId={scheduleId} isEditing />
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
                        scheduleId={scheduleId}
                        isEditing
                        closeDetail={() =>
                            setDetailData({ opened: false, isConflict: detailData.isConflict })
                        }
                        isConflict={detailData && detailData.isConflict}
                    />
                )}
            </Container>
        </Fragment>

    )
}

export default EditSchedule;

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
