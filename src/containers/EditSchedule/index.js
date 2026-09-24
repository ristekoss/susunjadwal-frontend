import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "redux/modules/appState";
import {
  Button,
  useColorModeValue,
  Text,
  Image,
  InputGroup,
  InputLeftElement,
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Course from "../BuildSchedule/Course";
import Detail from "../BuildSchedule/Detail";
import Checkout from "../BuildSchedule/Checkout";
import SearchInput from "../../components/SearchInput";
import SelectMajor from "../BuildSchedule/SelectMajor";
import {
  Container,
  InfoContent,
  CoursePickerContainer,
  SelectedCoursesContainer,
  CategoryHeading,
} from "../BuildSchedule";

import { setCourses as reduxSetCourses } from "redux/modules/courses";
import CourseFilterPanel, {
  FilterPopupContainer,
  FilterTriggerButton,
} from "../BuildSchedule/CourseFilters";
import {
  DEFAULT_COURSE_FILTERS,
  applyClientSideCourseFilters,
  buildCourseFilterFetchSignature,
  buildCourseFilterParams,
  countActiveFilters,
} from "utils/courseFilters";

import { addSchedule, clearSchedule } from "redux/modules/schedules";
import { generateScheduledCourseListFromSchedule } from "./utils";
import SelectedCourses from "containers/SelectedCourses";
import { getSchedule, getCourses, getCoursesByKd } from "services/api";
import { BauhausSide } from "components/Bauhaus";
import { makeAtLeastMs } from "utils/promise";
import searchImg from "assets/Search.svg";
import searchImgDark from "assets/Search-dark.svg";
import arrowImg from "assets/Arrow.svg";
import notFoundImg from "assets/NotFound.svg";
import notFoundDarkImg from "assets/NotFound-dark.svg";
import settingsImg from "assets/Settings.svg";
import settingsDarkImg from "assets/Settings-dark.svg";

const EditSchedule = ({ match }) => {
  const isAnnouncement = useSelector((state) => state.appState.isAnnouncement);
  const { isMobile } = useSelector((state) => state.appState);
  const auth = useSelector((state) => state.auth);
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const theme = useColorModeValue("light", "dark");
  const [majorSelected, setMajorSelected] = useState();
  const [courses, setCourses] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);
  const [value, setValue] = useState("");
  const [showSelectMajor, setShowSelectMajor] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_COURSE_FILTERS);
  const [debouncedFilters, setDebouncedFilters] = useState(
    DEFAULT_COURSE_FILTERS,
  );
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef(filters);
  const lastFilterSignatureRef = useRef(null);
  const hasLoadedScheduleRef = useRef(false);
  const [filterResultCount, setFilterResultCount] = useState(null);
  const filterCountRequestId = useRef(0);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 600);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    async function fetchSchedule() {
      dispatch(setLoading(true));
      const {
        data: { user_schedule },
      } = await makeAtLeastMs(getSchedule(match.params.scheduleId), 1000);
      const formattedSchedule = await generateScheduledCourseListFromSchedule(
        auth.majorId,
        user_schedule,
      );
      formattedSchedule.forEach((schd) => {
        dispatch(addSchedule(schd));
      });
      dispatch(setLoading(false));
    }

    if (!!courses && !hasLoadedScheduleRef.current) {
      hasLoadedScheduleRef.current = true;
      fetchSchedule();
    }
  }, [match, dispatch, courses, auth.majorId]);

  const fetchCourses = useCallback(
    async (majorId, majorSelected, filterParams = null) => {
      dispatch(setLoading(true));
      const { data } = majorSelected
        ? await getCoursesByKd(majorSelected.kd_org, filterParams || undefined)
        : await getCourses(majorId);

      if (!majorSelected) {
        dispatch(clearSchedule());
      }
      setCourses(data.courses);
      setCoursesDetail(data.courses?.length > 0);
      setLastUpdated(
        data.last_update_at ? new Date(data.last_update_at) : null,
      );
      if (data.courses) {
        dispatch(reduxSetCourses(data.courses));
      }

      setTimeout(() => dispatch(setLoading(false)), 2000);
    },
    [dispatch],
  );

  useEffect(() => {
    document.getElementById("input").value = "";
    setValue("");
    const majorId = auth.majorId;
    const filterParams = buildCourseFilterParams(filtersRef.current, "");
    lastFilterSignatureRef.current = buildCourseFilterFetchSignature(
      majorId,
      majorSelected,
      filterParams,
    );
    fetchCourses(majorId, majorSelected, filterParams);
  }, [auth.majorId, dispatch, fetchCourses, setValue, majorSelected]);

  useEffect(() => {
    if (!courses || !majorSelected) return;
    const keyword = debouncedFilters.fuzzy ? debouncedValue : "";
    const filterParams = buildCourseFilterParams(debouncedFilters, keyword);
    const signature = buildCourseFilterFetchSignature(
      auth.majorId,
      majorSelected,
      filterParams,
    );
    if (signature === lastFilterSignatureRef.current) return;
    lastFilterSignatureRef.current = signature;
    fetchCourses(auth.majorId, majorSelected, filterParams);
  }, [
    debouncedFilters,
    debouncedValue,
    courses,
    majorSelected,
    auth.majorId,
    fetchCourses,
  ]);

  const handleFilterDraftChange = useCallback(
    async (draft) => {
      if (!courses) {
        setFilterResultCount(null);
        return;
      }
      const filtered = applyClientSideCourseFilters(courses, draft);
      setFilterResultCount(filtered ? filtered.length : 0);
    },
    [courses],
  );

  const clientFilteredCourses = applyClientSideCourseFilters(
    courses,
    debouncedFilters,
  );

  const serverSearchActive = debouncedFilters.fuzzy && !!value.trim();
  const filteredCourse = serverSearchActive
    ? clientFilteredCourses
    : clientFilteredCourses?.filter((c) => {
        if (value === "") {
          return c;
        } else if (c.name.toLowerCase().includes(value.toLowerCase())) {
          return c;
        } else {
          return null;
        }
      });

  const groupedCourses =
    filteredCourse && filteredCourse.length > 0
      ? filteredCourse.reduce(
          (acc, course) => {
            if (course.category === "Kelas Internal") {
              acc.internal.push(course);
            } else if (course.category === "Kelas Eksternal") {
              acc.external.push(course);
            } else {
              acc.bersama.push(course);
            }
            return acc;
          },
          { internal: [], external: [], bersama: [] },
        )
      : null;

  return (
    <>
      <BauhausSide />
      <Helmet title="Edit Jadwal" />

      <Container>
        <CoursePickerContainer isMobile={isMobile} mode={theme}>
          {isMobile}
          <h1>Edit Jadwal</h1>

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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "26px",
                }}
              >
                <FilterTriggerButton
                  count={countActiveFilters(filters)}
                  onClick={() => setShowFilters(!showFilters)}
                  theme={theme}
                  isMobile={isMobile}
                  disabled={!majorSelected}
                  title={
                    majorSelected
                      ? "Filter kelas"
                      : "Pilih Program Studi terlebih dahulu"
                  }
                />
                <InputGroup h={isMobile ? "44px" : "57px"} style={{ flex: 1 }}>
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
                      theme === "light"
                        ? "primary.Purple"
                        : "primary.LightPurple"
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

              {showFilters && (
                <FilterPopupContainer isMobile={isMobile}>
                  <CourseFilterPanel
                    appliedFilters={filters}
                    onApply={(nextFilters) => {
                      setFilters(nextFilters);
                      setShowFilters(false);
                    }}
                    onClose={() => setShowFilters(false)}
                    onDraftChange={handleFilterDraftChange}
                    resultCount={filterResultCount}
                    theme={theme}
                    isMobile={isMobile}
                  />
                </FilterPopupContainer>
              )}
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
                {majorSelected.educational_program.replace(
                  / *\([^)]*\) */g,
                  "",
                )}{" "}
                yang melakukan{" "}
                <Link to="/update">
                  <Text
                    color={theme === "light" ? "#5038BC" : "#917DEC"}
                    as="u"
                  >
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
              <>
                {groupedCourses && groupedCourses.internal.length > 0 && (
                  <>
                    <CategoryHeading
                      $color={theme === "light" ? "#5038BC" : "#917DEC"}
                      $mode={theme}
                    >
                      Kelas Internal
                    </CategoryHeading>
                    {groupedCourses.internal.map((course, idx) => (
                      <Course
                        key={`internal-${course.name}-${idx}`}
                        course={course}
                      />
                    ))}
                  </>
                )}
                {groupedCourses && groupedCourses.external.length > 0 && (
                  <>
                    <CategoryHeading
                      $color={theme === "light" ? "#5038BC" : "#917DEC"}
                      $mode={theme}
                    >
                      Kelas Eksternal
                    </CategoryHeading>
                    {groupedCourses.external.map((course, idx) => (
                      <Course
                        key={`external-${course.name}-${idx}`}
                        course={course}
                      />
                    ))}
                  </>
                )}
                {groupedCourses && groupedCourses.bersama.length > 0 && (
                  <>
                    <CategoryHeading
                      $color={theme === "light" ? "#5038BC" : "#917DEC"}
                      $mode={theme}
                    >
                      Kelas Bersama
                    </CategoryHeading>
                    {groupedCourses.bersama.map((course, idx) => (
                      <Course
                        key={`bersama-${course.name}-${idx}`}
                        course={course}
                      />
                    ))}
                  </>
                )}
              </>
            ))}
        </CoursePickerContainer>
        {!isMobile && (
          <SelectedCoursesContainer
            isAnnouncement={isAnnouncement}
            mode={theme}
          >
            <SelectedCourses scheduleId={scheduleId} isEditing />
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
            scheduleId={scheduleId}
            isEditing
            closeDetail={() =>
              setDetailData({
                opened: false,
                isConflict: detailData.isConflict,
              })
            }
            isConflict={detailData && detailData.isConflict}
          />
        )}
      </Container>
    </>
  );
};

export default EditSchedule;
