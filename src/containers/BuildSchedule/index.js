import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  useColorModeValue,
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
import { setLoading } from "redux/modules/appState";
import { getCourses, getCoursesByKd } from "services/api";

import SelectedCourses from "containers/SelectedCourses";
import { BauhausSide } from "components/Bauhaus";
import Checkout from "./Checkout";
import Course from "./Course";
import Detail from "./Detail";
import SearchInput from "../../components/SearchInput";

import searchImg from "assets/Search.svg";
import searchImgDark from "assets/Search-dark.svg";
import arrowImg from "assets/Arrow.svg";
import notFoundImg from "assets/NotFound.svg";
import notFoundDarkImg from "assets/NotFound-dark.svg";
import SelectMajor from "./SelectMajor";
import settingsImg from "assets/Settings.svg";
import settingsDarkImg from "assets/Settings-dark.svg";

function BuildSchedule() {
  const isAnnouncement = useSelector((state) => state.appState.isAnnouncement);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [majorSelected, setMajorSelected] = useState();
  const [detailData, setDetailData] = useState(null);
  const [courses, setCourses] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);
  const [value, setValue] = useState("");
  const [showSelectMajor, setShowSelectMajor] = useState(false);

  const theme = useColorModeValue("light", "dark");

  const fetchCourses = useCallback(
    async (majorId, majorSelected) => {
      dispatch(setLoading(true));

      try {
        const { data } = majorSelected
          ? await getCoursesByKd(majorSelected.kd_org)
          : await getCourses(majorId);

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
    document.getElementById("input").value = "";
    setValue("");
    const majorId = auth.majorId;
    fetchCourses(majorId, majorSelected);
  }, [auth.majorId, majorSelected, dispatch, fetchCourses, setValue]);

  // const handleChange = (e) => setValueTemporary(e.target.value);

  let filteredCourse = courses?.filter((c) => {
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

        {lastUpdated && courses && (
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
        <div
          style={{
            display: courses === null ? "none" : "block",
            marginTop: !isCoursesDetail && majorSelected ? "20px" : "0",
          }}
        >
          <SelectMajor
            theme={theme}
            isMobile={isMobile}
            setMajorSelected={setMajorSelected}
            show={isMobile ? showSelectMajor : true}
          />
          <div
            style={{
              position: "relative",
            }}
          >
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
                placeholder="Cari Mata Kuliah"
                theme={theme}
                options={courses}
                setValue={setValue}
              />

              <Button
                w="95px"
                h="full"
                borderLeftRadius="0"
                bg={
                  theme === "light" ? "primary.Purple" : "primary.LightPurple"
                }
                onMouseDown={() =>
                  setValue(document.getElementById("input").value)
                }
                fontSize={isMobile && "14px"}
                px={isMobile && "4px"}
                display={isMobile && "none"}
              >
                <Center>
                  Cari
                  <Image alt="" src={arrowImg} ml="9px" />
                </Center>
              </Button>
              <Button
                variant="outline"
                marginLeft="10px"
                height="44px"
                width="44px"
                p="0"
                display={isMobile ? "flex" : "none"}
                onClick={() => setShowSelectMajor(!showSelectMajor)}
                borderColor={theme === "dark" && "primary.LightPurple"}
              >
                <Image
                  alt="Show"
                  src={theme === "light" ? settingsImg : settingsDarkImg}
                />
              </Button>
            </InputGroup>
          </div>
        </div>

        {!isCoursesDetail && majorSelected && (
          <Center flexDirection="column" mt="3.5rem">
            <Image
              alt=""
              src={theme === "light" ? notFoundImg : notFoundDarkImg}
            />
            <Text
              mt="20px"
              color={theme === "light" ? "#33333399" : "#FFFFFF99"}
              textAlign="center"
              maxW="450px"
            >
              Oops, belum ada mahasiswa dari jurusan{" "}
              {majorSelected.study_program.replace(/ *\([^)]*\) */g, "")},{" "}
              {majorSelected.educational_program.replace(/ *\([^)]*\) */g, "")}{" "}
              yang melakukan{" "}
              <Link to="/update">
                <Text color={theme === "light" ? "#5038BC" : "#917DEC"} as="u">
                  <span>update matkul</span>
                </Text>
              </Link>
            </Text>
          </Center>
        )}

        {courses === null && (
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
                textAlign="center"
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
