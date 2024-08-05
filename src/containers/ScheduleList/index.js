import React, { useEffect, useState, useRef } from "react";
import ReactGA from "react-ga";
// import { useMixpanel } from "hooks/useMixpanel";
import { useHistory } from "react-router";
import {
  Button,
  Box,
  Center,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  Flex,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import { copyImageToClipboard } from "copy-image-clipboard";

import ScheduleDetail from "./ScheduleDetail";
import SearchInput from "components/SearchInput";
import SortByTermButton from "containers/ScheduleList/SortByTermButton";
import { setLoading } from "redux/modules/appState";
import { getSchedules, deleteSchedule } from "services/api";
import { convertPeriodToLiteral, groupScheduleByPeriod } from "utils/schedule";
import { makeAtLeastMs } from "utils/promise";
import { SuccessToast, ErrorToast } from "components/Toast";
import { BauhausSide } from "components/Bauhaus";
import GoogleCalendarModal from "../ViewSchedule/GoogleCalendarModal";

import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";
import BauhausDarkDesktop from "assets/Beta/bauhaus-dark-lg.svg";
import alertImg from "assets/Alert2.svg";
import linkImg from "assets/Link.svg";
import copyImg from "assets/Copy.svg";
import alertDarkImg from "assets/Alert-dark.svg";
import linkDarkImg from "assets/Link-dark.svg";
import copyDarkImg from "assets/Copy-dark.svg";
import searchImg from "assets/Search.svg";
import searchImgDark from "assets/Search-dark.svg";
import arrowImg from "assets/Arrow.svg";
import notFoundImg from "assets/NotFound.svg";
import notFoundDarkImg from "assets/NotFound-dark.svg";

const ScheduleList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareModal = useDisclosure();
  const theme = useColorModeValue("light", "dark");

  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [query, setQuery] = useState("");
  const [schedules, setSchedules] = useState();
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [scheduleTitles, setScheduleTitles] = useState();
  const [groupedSchedule, setGroupedSchedule] = useState();
  const [periods, setPeriods] = useState();
  const [isSortByLatest, setSortByLatest] = useState(true);

  const [imageURL, setImageURL] = useState("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      dispatch(setLoading(true));
      const {
        data: { user_schedules },
      } = await makeAtLeastMs(getSchedules(auth.userId), 1000);

      setSchedules(user_schedules);
      setFilteredSchedules(user_schedules);
      const [grouped, periods] = groupScheduleByPeriod(user_schedules);

      setScheduleTitles(user_schedules.filter((schedule) => schedule.name));
      setGroupedSchedule(grouped);
      setPeriods(periods.reverse());

      dispatch(setLoading(false));
    };

    fetchSchedules();
  }, [dispatch, auth]);

  useEffect(() => {
    if (query !== "") {
      setFilteredSchedules(
        schedules.filter((schedule) =>
          schedule?.name?.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } else {
      setFilteredSchedules(schedules);
    }
  }, [query, schedules]);

  useEffect(() => {
    if (filteredSchedules?.length > 0) {
      const [grouped, periods] = groupScheduleByPeriod(filteredSchedules);
      setGroupedSchedule(grouped);
      setPeriods(isSortByLatest ? periods.reverse() : periods.sort());
    }
  }, [filteredSchedules, isSortByLatest]);

  useEffect(() => {
    // TODO: Re-enable mixpanel or change to other analytics
    // useMixpanel.track("open_daftar_jadwal");
  }, []);

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    // TODO: Re-enable mixpanel or change to other analytics
    // else useMixpanel.track("search_daftar_jadwal");
  }, [query]);

  const performDeleteSchedule = async (userId, scheduleId) => {
    ReactGA.event({
      category: "Hapus Jadwal",
      action: "Deleted a schedule",
    });
    dispatch(setLoading(true));
    onClose();
    await makeAtLeastMs(deleteSchedule(userId, scheduleId), 1000);
    const {
      data: { user_schedules },
    } = await makeAtLeastMs(getSchedules(auth.userId), 1000);
    setSchedules(user_schedules);
    dispatch(setLoading(false));
  };

  const confirmDeleteSchedule = (scheduleId) => {
    performDeleteSchedule(auth.userId, scheduleId);
  };

  const showDialogDelete = (id) => {
    setSelectedId(id);
    onOpen();
  };

  const showAlertCopy = (type) => {
    ReactGA.event({
      category: "Bagikan Jadwal",
      action: "Copied a schedule's URL",
    });
    SuccessToast(`${type} berhasil disalin!`, isMobile, theme);
  };

  const showErrorCopy = () => {
    ReactGA.event({
      category: "Bagikan Jadwal",
      action: "Copied a schedule's image",
    });
    ErrorToast(
      "Uh oh, terjadi kesalahan. Coba ganti browser atau device yang Anda gunakan.",
      isMobile,
      theme,
    );
  };

  const handleClickEditJadwal = (idJadwal) => {
    history.push(`/edit/${idJadwal}`);
  };

  const showDialogShare = (id, name, dataUrl) => {
    setSelectedId(id);
    setSelectedName(name);
    setImageURL(dataUrl);
    shareModal.onOpen();
  };

  const copyImage = () => {
    copyImageToClipboard(imageURL)
      .then(() => showAlertCopy("Gambar"))
      .catch((e) => showErrorCopy());
  };

  return (
    <Container>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={theme === "light" ? "white" : "dark.LightBlack"}>
          <ModalBody>Apakah kamu yakin ingin menghapus jadwal?</ModalBody>

          <ModalFooter>
            <Button
              onClick={onClose}
              variant="outline"
              borderColor={
                theme === "light" ? "primary.Purple" : "dark.LightPurple"
              }
              color={theme === "light" ? "primary.Purple" : "dark.Purple"}
            >
              Batal
            </Button>
            <Button
              onClick={() => confirmDeleteSchedule(selectedId)}
              variant="danger"
              bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
              color={theme === "light" ? "white" : "dark.White"}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={shareModal.isOpen} onClose={shareModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={theme === "light" ? "white" : "dark.LightBlack"}>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column">
              <Text mb="8px">
                Bagikan Jadwal <b>{selectedName}</b>
              </Text>
              <Image alt="" src={imageURL} maxH="30vh" objectFit="contain" />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex flexDirection="column">
              <Flex flexDirection={isMobile ? "column" : "row"}>
                <CopyToClipboard
                  text={`${window.location.href}/${selectedId}`}
                  onCopy={() => showAlertCopy("Link")}
                >
                  <Button
                    variant="outline"
                    borderColor={
                      theme === "light" ? "primary.Purple" : "dark.LightPurple"
                    }
                    color={theme === "light" ? "primary.Purple" : "dark.Purple"}
                    mb={isMobile ? "8px !important" : "0"}
                  >
                    <img
                      src={theme === "light" ? linkImg : linkDarkImg}
                      style={{ marginRight: "4px" }}
                      alt=""
                    />
                    Copy Link
                  </Button>
                </CopyToClipboard>
                <Button
                  variant="solid"
                  onClick={copyImage}
                  bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
                  color={theme === "light" ? "white" : "dark.White"}
                >
                  <img
                    src={theme === "light" ? copyImg : copyDarkImg}
                    style={{ marginRight: "8px" }}
                    alt=""
                  />
                  Copy Image
                </Button>
              </Flex>
              <Flex mt="1rem">
                <img
                  src={theme === "light" ? alertImg : alertDarkImg}
                  style={{ height: "24px" }}
                  alt=""
                />
                <Text fontSize={isMobile && "12px"}>
                  <b>Copy Image</b> akan menyalin gambar ke clipboard sementara{" "}
                  <b>Copy Link</b> akan menyalin link jadwal
                </Text>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Helmet
        title="Daftar Jadwal"
        meta={[{ name: "description", content: "Description of Jadwal" }]}
      />

      {!!schedules?.length && (
        <>
          <BauhausSide />
          <PageTitle mobile={isMobile} mode={theme}>
            Daftar Jadwal
          </PageTitle>
          <PageHeader>
            <InputGroup h={isMobile ? "44px" : "57px"}>
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
                placeholder="Cari Jadwal Kuliah"
                theme={theme}
                options={scheduleTitles}
                setValue={setQuery}
              />
              <Button
                w="95px"
                h="full"
                borderLeftRadius="0"
                bg={
                  theme === "light" ? "primary.Purple" : "primary.LightPurple"
                }
                onMouseDown={() => {
                  setQuery(document.getElementById("input").value);
                  // TODO: Re-enable mixpanel or change to other analytics
                  // useMixpanel.track("search_daftar_jadwal");
                }}
                fontSize={isMobile && "14px"}
                px={isMobile && "4px"}
                display={isMobile && "none"}
              >
                <Center>
                  Cari
                  <Image alt="" src={arrowImg} ml="9px" />
                </Center>
              </Button>
            </InputGroup>
            <SortByTermButton
              isSortByLatest={isSortByLatest}
              setSortByLatest={setSortByLatest}
            />
          </PageHeader>
        </>
      )}

      {!!schedules?.length ? (
        <>
          {!!filteredSchedules?.length > 0 ? (
            <CardContainer>
              {periods?.map((period) => {
                return (
                  <>
                    <PeriodTitle mobile={isMobile} mode={theme}>
                      {convertPeriodToLiteral(period)}
                    </PeriodTitle>

                    {groupedSchedule[period]?.map((schedule, idx) => (
                      <ScheduleDetail
                        schedule={schedule}
                        idx={idx}
                        key={schedule.id}
                        showModal={showDialogDelete}
                        editSchedule={handleClickEditJadwal}
                        showShareModal={showDialogShare}
                      />
                    ))}
                  </>
                );
              })}
            </CardContainer>
          ) : (
            <Center flexDirection="column" mt="3.5rem" marginX="48px">
              <Image
                alt=""
                src={theme === "light" ? notFoundImg : notFoundDarkImg}
              />
              <Text
                mt="20px"
                color={theme === "light" ? "#33333399" : "#FFFFFF99"}
                textAlign="center"
              >
                Jadwal yang dicari tidak ditemukan
              </Text>
            </Center>
          )}
        </>
      ) : (
        <>
          {isMobile ? (
            <AssetBauhaus
              isMobile={isMobile}
              src={BauhausMobile}
              alt="bauhaus-sm"
            />
          ) : (
            <AssetBauhaus
              src={theme === "light" ? BauhausDesktop : BauhausDarkDesktop}
              alt="bauhaus-lg"
            />
          )}
          <Box pt="90px" mb={{ base: 16, md: "160px" }}>
            <div
              style={{ textAlign: isMobile ? "center" : "left", width: "100%" }}
            >
              <PageTitleNoSchedule mobile={isMobile} mode={theme}>
                Daftar Jadwal
              </PageTitleNoSchedule>
              <PageInfo mobile={isMobile} mode={theme}>
                Anda belum pernah membuat jadwal. Mulai susun jadwal anda
                sekarang!
              </PageInfo>
              <Link to={`/susun`}>
                <Button
                  height={{ base: "44px", md: "57px" }}
                  width={{ base: "137px", md: "194px" }}
                  ml={{ md: 12 }}
                  fontSize={{ base: "14px", md: "18px" }}
                  bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
                  color={theme === "light" ? "white" : "dark.White"}
                >
                  Buat Jadwal
                </Button>
              </Link>
            </div>
          </Box>
        </>
      )}

      <GoogleCalendarModal />
    </Container>
  );
};

const Container = styled.div`
  margin-left: -3rem;
  margin-right: -3rem;
`;

const PageTitle = styled.h1`
  margin: ${({ mobile }) => (mobile ? "-40px 0 0 0px" : "0px 48px 30px 48px")};
  font-size: ${({ mobile }) => (mobile ? "1.7rem" : "2rem")};
  text-align: center;
  font-weight: bold;
  color: ${({ mode }) => (mode === "light" ? "#5038bc" : "#917DEC")};
`;

const PageTitleNoSchedule = styled.h1`
  font-size: ${({ mobile }) => (mobile ? "50px" : "64px")};
  font-weight: bold;
  color: ${({ mode }) => (mode === "light" ? "#5038bc" : "#917DEC")};
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 16px 48px")};
`;

const PageInfo = styled.h2`
  font-size: ${({ mobile }) => (mobile ? "14px" : "18px")};
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 48px 48px")};
  color: ${({ mode }) => (mode === "light" ? "#333333" : "#D0D0D0")};
`;

const PageHeader = styled.div`
  padding: ${(props) => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  width: 100%;
  display: flex;
`;

const PeriodTitle = styled.h1`
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: ${({ mobile }) => (mobile ? "1.5rem" : "1.75rem")};
  font-weight: bold;
  color: ${({ mode }) =>
    mode === "light"
      ? (props) => props.theme.color.secondaryMineShaft
      : (props) => props.theme.color.darkWhite};

  @media (min-width: 900px) {
    margin-top: 48px;
  }
`;

const CardContainer = styled.div`
  padding: ${(props) => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  width: 100%;
`;

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  ${(props) =>
    props.isMobile &&
    `
    top: 50px;
    width: 100%;
    display: block;
    @media (min-width: 540px) {
      display: none;
    }
  `}
`;

const ModalContent = styled(ChakraModalContent).attrs({
  padding: { base: "16px 24px", lg: "20px 24px" },
  width: { base: "90%", lg: "initial" },
  textAlign: "center",
})``;

const ModalFooter = styled(ChakraModalFooter).attrs({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: { base: "12px", lg: "16px" },
})`
  button {
    margin: 0px 4px;
  }
`;

export default ScheduleList;
