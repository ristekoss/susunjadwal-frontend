import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  useColorModeValue,
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Center,
  Text,
} from "@chakra-ui/react";
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
import SearchInput from "./SearchInput";
import FACULTIES from "utils/faculty-base-additional-info.json";
import { useForm } from "react-hook-form";
import { CustomSelect } from "components/CustomSelect";
import searchImg from "assets/Search.svg";
import searchImgDark from "assets/Search-dark.svg";
import arrowImg from "assets/Arrow.svg";
import notFoundImg from "assets/NotFound.svg";
import notFoundDarkImg from "assets/NotFound-dark.svg";

function BuildSchedule() {
  const isAnnouncement = useSelector((state) => state.appState.isAnnouncement);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [detailData, setDetailData] = useState(null);
  const [courses, setCourses] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);
  const [value, setValue] = useState("");

  const theme = useColorModeValue("light", "dark");

  const fetchCourses = useCallback(
    async (majorId) => {
      dispatch(setLoading(true));

      try {
        const { data } = await getCourses(majorId);
        setCourses(data.courses);

        setCoursesDetail(data.is_detail);

        setLastUpdated(new Date(data.last_update_at));
        dispatch(reduxSetCourses(data.courses));
      } catch (e) {
        /** TODO: handle error */
      }

      setTimeout(() => dispatch(setLoading(false)), 1000);
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearSchedule());
    const majorId = auth.majorId;
    fetchCourses(majorId);
  }, [auth.majorId, dispatch, fetchCourses]);

  // const handleChange = (e) => setValueTemporary(e.target.value);

  const { register, watch } = useForm();
  const selectedFaculty = watch("fakultas");

  const filteredCourse = courses?.filter((c) => {
    if (value === "") {
      //if value is empty
      return c;
    } else if (c.name.toLowerCase().includes(value.toLowerCase())) {
      //returns filtered array
      return c;
    } else {
      return null;
    }
  });

  return (
    <Container>
      <BauhausSide />
      <Helmet title="Buat Jadwal" />

      <CoursePickerContainer isMobile={isMobile} mode={theme}>
        <h1>Buat Jadwal</h1>

        {lastUpdated && (
          <h6>
            Jadwal terakhir diperbarui pada {isMobile ? <br /> : " "}
            <span>
              {lastUpdated?.getDate() +
                "/" +
                (lastUpdated?.getMonth() + 1) +
                "/" +
                lastUpdated?.getFullYear() +
                " " +
                lastUpdated?.toLocaleTimeString()}
            </span>
          </h6>
        )}

        <Flex flexDir={{ base: "column", lg: "row" }}>
          <CustomSelect
            name="fakultas"
            label="Fakultas"
            register={register}
            mr={{ base: "0", lg: "7px" }}
            mode={theme}
            isMobile={isMobile}
          >
            {Object.keys(FACULTIES).map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty.toLowerCase()}
              </option>
            ))}
          </CustomSelect>

          <CustomSelect
            name="program_studi"
            label="Program Studi"
            register={register}
            disabled={!selectedFaculty}
            ml={{ base: "0", lg: "7px" }}
            mode={theme}
            isMobile={isMobile}
          >
            {selectedFaculty &&
              FACULTIES[selectedFaculty].map((prodi) => (
                <option key={prodi.kd_org}>{`${prodi.study_program.replace(
                  / *\([^)]*\) */g,
                  "",
                )}, ${prodi.educational_program.replace(
                  / *\([^)]*\) */g,
                  "",
                )}`}</option>
              ))}
          </CustomSelect>
        </Flex>
        <div style={{ position: "relative" }}>
          <InputGroup h={isMobile ? "44px" : "57px"} mb="26px">
            <InputLeftElement
              h="full"
              pl={isMobile ? "14px" : "20px"}
              pointerEvents="none"
              children={
                <Image
                  alt=""
                  src={theme === "light" ? searchImg : searchImgDark}
                />
              }
            />
            <SearchInput
              isMobile={isMobile}
              theme={theme}
              courses={courses}
              setValue={setValue}
            />

            <Button
              w="95px"
              h="full"
              borderLeftRadius="0"
              bg={theme === "light" ? "primary.Purple" : "primary.LightPurple"}
              onMouseDown={() =>
                setValue(document.getElementById("input").value)
              }
              fontSize={isMobile && "14px"}
              px={isMobile && "4px"}
            >
              Cari
              <Image alt="" src={arrowImg} ml="9px" />
            </Button>
          </InputGroup>
        </div>
        {!isCoursesDetail && (
          <InfoContent mode={theme}>
            <p>
              Uh oh, sepertinya kami belum memiliki jadwal untuk jurusan kamu.
              Silahkan coba untuk melakukan <span>Update Matkul</span> dengan
              menekan tombol di bawah ini!
            </p>
            <Link to="/update">
              <Button
                mt={{ base: "1rem", lg: "1.5rem" }}
                bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
                color={theme === "light" ? "white" : "dark.White"}
              >
                Update Matkul
              </Button>
            </Link>
          </InfoContent>
        )}

        {courses?.length === 0 && (
          <InfoContent mode={theme}>
            <p>
              Uh oh, sepertinya jadwal jurusan kamu belum tersedia. Silahkan
              coba untuk melakukan <span>Update Matkul</span> lagi nanti!
            </p>
            <Link to="/update">
              <Button
                mt={{ base: "1rem", lg: "1.5rem" }}
                bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
                color={theme === "light" ? "white" : "dark.White"}
              >
                Update Matkul
              </Button>
            </Link>
          </InfoContent>
        )}

        {filteredCourse &&
          (filteredCourse?.length === 0 ? (
            <Center flexDirection="column" mt="3.5rem">
              <Image
                alt=""
                src={theme === "light" ? notFoundImg : notFoundDarkImg}
              />
              <Text
                mt="20px"
                color={theme === "light" ? "#33333399" : "#FFFFFF99"}
              >
                Mata kuliah yang dicari tidak ditemukan
              </Text>
            </Center>
          ) : (
            filteredCourse.map((course, idx) => (
              <Course key={`${course.name}-${idx}`} course={course} />
            ))
          ))}
      </CoursePickerContainer>

      {!isMobile && (
        <SelectedCoursesContainer isAnnouncement={isAnnouncement} mode={theme}>
          <SelectedCourses />
        </SelectedCoursesContainer>
      )}

      <Checkout
        isMobile={isMobile}
        onClickDetail={(isConflict) =>
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
  color: ${(props) => props.theme.color.secondaryMineShaft};
  margin-top: -40px;

  @media (min-width: 900px) {
    margin-top: 0px;
  }
`;

export const InfoContent = styled.div`
  margin: 48px 0 16px;
  text-align: center;
  min-height: 100vh;
  font-size: 16px;

  p {
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.secondaryMineshaft
        : (props) => props.theme.color.darkWhite}
  }

  p span {
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.primaryPurple
        : (props) => props.theme.color.darkPurple}
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
    color: ${({ mode }) =>
      mode === "light"
        ? (props) => props.theme.color.primaryPurple
        : (props) => props.theme.color.darkPurple};
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }

  h6 {
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
    color: ${({ mode }) =>
      mode === "light" ? "#333333" : (props) => props.theme.color.darkWhite};
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
  background-color: ${({ mode }) =>
    mode === "light"
      ? (props) => props.theme.color.primaryWhite
      : (props) => props.theme.color.darkBlack};
  padding: ${({ isAnnouncement }) =>
    isAnnouncement ? "162px 32px" : "120px 32px"};
  overflow-y: auto;
  position: fixed;
  height: 100vh;
  width: 25%;
  right: 0;
  top: 0;

  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
`;
