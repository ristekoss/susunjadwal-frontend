import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import Helmet from "react-helmet";
import ReactGA from "react-ga";
import CopyToClipboard from "react-copy-to-clipboard";
import * as htmlToImage from "html-to-image";
import { copyImageToClipboard } from "copy-image-clipboard";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  Text,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { CalendarIcon } from "@heroicons/react/solid";

import Schedule from "./Schedule";
import ScheduleList from "./ScheduleList";
import ControlledInput from "./ControlledInput";
import DownloadRef from "./DownloadRef";
import { SuccessToast, ErrorToast } from "components/Toast";
import Icons from "components/Icons";
import { getSchedule, postRenameSchedule, deleteSchedule } from "services/api";
import useDownloadCalendar from "hooks/useDownloadCalendar";
import { setLoading } from "redux/modules/appState";
import getFormattedSchedule from "utils/schedule";
import { makeAtLeastMs } from "utils/promise";
import { decodeHtmlEntity } from "utils/string";

import alertImg from "assets/Alert2.svg";
import linkImg from "assets/Link.svg";
import copyImg from "assets/Copy.svg";
import alertDarkImg from "assets/Alert-dark.svg";
import linkDarkImg from "assets/Link-dark.svg";
import copyDarkImg from "assets/Copy-dark.svg";
import exportToIcsImg from "assets/ExportToIcs.svg";
import downloadImg from "assets/Download.svg";
import deleteImg from "assets/Delete.svg";
import clipboardImg from "assets/Clipboard.svg";
import ics2025Img from "assets/ics2025.svg";
import { ListMatkulIcon } from "assets/ListMatkulIcon";

import FeedbackModal from "./FeedbackModal";
import GoogleCalendarModal from "./GoogleCalendarModal";

function ViewSchedule({ match, history }) {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareModal = useDisclosure();
  const feedbackModal = useDisclosure();
  const googleCalendarModal = useDisclosure();
  const auth = useSelector((state) => state.auth);
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const { generateICalendarFile } = useDownloadCalendar(theme);

  const [schedule, setSchedule] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [isDisplayTimetable, setIsDisplayTimetable] = useState(true);
  const [imageURL, setImageURL] = useState(null);

  const location = useLocation();

  let formattedSchedule = {};
  let totalCredits = 0;

  if (schedule) {
    [formattedSchedule, totalCredits] = getFormattedSchedule(schedule);
  }

  async function onRename(slug, value) {
    if (auth) {
      await postRenameSchedule(auth.userId, slug, value);
      setSchedule({ ...schedule, name: value });
    }
  }

  useEffect(() => {
    async function fetchSchedule() {
      dispatch(setLoading(true));
      const {
        data: { user_schedule },
      } = await makeAtLeastMs(getSchedule(match.params.scheduleId), 1000);
      setSchedule(user_schedule);
      setCreatedAt(new Date(user_schedule.created_at));
      dispatch(setLoading(false));
    }
    fetchSchedule();
    if (location.state?.feedbackPopup) {
      feedbackModal.onOpen();
    }
  }, [match, dispatch]);

  const scheduleName = schedule && schedule.name;

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

  const performDeleteSchedule = async (userId, scheduleId) => {
    ReactGA.event({
      category: "Hapus Jadwal",
      action: "Deleted a schedule",
    });
    dispatch(setLoading(true));
    await makeAtLeastMs(deleteSchedule(userId, scheduleId), 1000);
    history.push("/jadwal");
  };

  const confirmDeleteSchedule = (scheduleId) => {
    performDeleteSchedule(auth.userId, scheduleId);
  };

  const refs = useRef(null);

  const downloadImage = async () => {
    ReactGA.event({
      category: "Download Jadwal Image",
      action: "Downloaded a schedule's image",
    });

    const dataUrl = await htmlToImage.toPng(refs.current);
    const link = document.createElement("a");

    link.download = !scheduleName ? "Untitled.png" : scheduleName + ".png";
    link.href = dataUrl;
    link.click();
  };

  const openShareModal = async () => {
    const dataUrl = await htmlToImage.toPng(refs.current);
    setImageURL(dataUrl);
    shareModal.onOpen();
  };

  const copyImage = () => {
    copyImageToClipboard(imageURL)
      .then(() => showAlertCopy("Gambar"))
      .catch((e) => showErrorCopy());
  };

  const handleFeedbackModalClose = () => {
    feedbackModal.onClose();
    history.replace({
      ...location,
      state: { ...location.state, feedbackPopup: false },
    });
  };

  const handleOpenGoogleCalendarModal = () => {
    ReactGA.event({
      category: "Integrasi Calendar",
      action: "Opened Google Calendar Modal",
    });
    googleCalendarModal.onOpen();
  };

  return (
    <>
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={handleFeedbackModalClose}
      />

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
              onClick={() => confirmDeleteSchedule(schedule.id)}
              variant="danger"
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
                Bagikan Jadwal <b>{scheduleName}</b>
              </Text>
              <Image alt="" src={imageURL} maxH="30vh" objectFit="contain" />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex flexDirection="column">
              <Flex flexDirection={isMobile ? "column" : "row"}>
                <CopyToClipboard
                  text={`${window.location.href}/${scheduleId}`}
                  onCopy={() => showAlertCopy("Link")}
                >
                  <Button
                    variant="outline"
                    mb={isMobile ? "8px !important" : "0"}
                    borderColor={
                      theme === "light" ? "primary.Purple" : "dark.LightPurple"
                    }
                    color={theme === "light" ? "primary.Purple" : "dark.Purple"}
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

      <MainContainer>
        <Helmet
          title={scheduleName ? `Jadwal ${scheduleName}` : `Jadwal Untitled`}
          meta={[{ name: "description", content: "Description of Jadwal" }]}
        />

        {schedule && (
          <>
            <Container>
              <HeaderContainer>
                {schedule.has_edit_access ? (
                  <ScheduleNameEditable>
                    <ControlledInput
                      style={{ color: theme === "light" ? "aqua" : "orange" }}
                      name={decodeHtmlEntity(schedule.name)}
                      slug={match.params.scheduleId}
                      rename={onRename}
                    />
                    <p>
                      Dibuat pada{" "}
                      {createdAt?.getDate() +
                        "/" +
                        (createdAt?.getMonth() + 1) +
                        "/" +
                        createdAt?.getFullYear()}{" "}
                      • {totalCredits} SKS
                    </p>
                  </ScheduleNameEditable>
                ) : (
                  <ScheduleName mode={theme}>
                    {decodeHtmlEntity(schedule.name)}
                  </ScheduleName>
                )}

                <IconContainer isAuthenticated={Boolean(auth)}>
                  <Icons
                    Items={[
                      {
                        desc: "Download Jadwal",
                        icon: downloadImg,
                        alt: "download",
                        action: downloadImage,
                      },
                      {
                        desc: "Ekspor ke .ics (Google Calendar/Apple Calendar)",
                        icon: exportToIcsImg,
                        alt: "export-to-ics",
                        action: () => generateICalendarFile(schedule),
                      },
                      {
                        desc: "Share Jadwal",
                        icon: clipboardImg,
                        alt: "copy",
                        action: openShareModal,
                      },
                      {
                        desc: "Delete Jadwal",
                        icon: deleteImg,
                        alt: "delete",
                        action: onOpen,
                      },
                    ]}
                  />
                </IconContainer>
              </HeaderContainer>

              <ButtonContainer isAuthenticated={Boolean(auth)}>
                <Flex
                  direction="row"
                  gap={{ base: "10px", md: "15px" }}
                  width={{ base: "100%", md: "82%" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link to={`/edit/${scheduleId}`}>
                    <Button
                      width="full"
                      mr="0"
                      intent="primary"
                      variant="outline"
                      borderColor={
                        theme === "light"
                          ? "primary.Purple"
                          : "dark.LightPurple"
                      }
                      color={
                        theme === "light" ? "primary.Purple" : "dark.Purple"
                      }
                      fontSize={{ base: "16px", md: "18px" }}
                      minW={{ base: "120px", md: "100px" }}
                      px={{ base: "32px", md: "auto" }}
                      py={{ base: "14px", md: "auto" }}
                    >
                      {schedule.has_edit_access ? "Edit" : "Copy"}
                    </Button>
                  </Link>

                  <Button
                    width="full"
                    flex="1"
                    mr="0"
                    size="sm"
                    px={{ base: "32px", md: "100px" }}
                    py={{ base: "20px", md: "20px" }}
                    variant="solid"
                    bg={
                      theme === "light" ? "primary.Purple" : "dark.LightPurple"
                    }
                    color={theme === "light" ? "white" : "dark.White"}
                    onClick={handleOpenGoogleCalendarModal}
                    fontSize={{ base: "14px", md: "18px" }}
                    minW={{ base: "140px", md: "140px" }}
                    _hover={{
                      bg:
                        theme === "light"
                          ? "primary.DarkPurple"
                          : "dark.Purple",
                    }}
                  >
                    <Text display={{ base: "none", sm: "inline" }}>
                      Integrasi Kalender
                    </Text>
                    <Text display={{ base: "inline", sm: "none" }}>
                      Integrasi
                    </Text>
                    <img
                      src={ics2025Img}
                      style={{ marginLeft: "6px", height: "25px" }}
                      alt="export-to-ics"
                    />
                  </Button>
                </Flex>
              </ButtonContainer>
            </Container>
            <ViewToggleContainer>
              <ViewListContainer
                isActive={!isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(false)}
                mode={theme}
              >
                <ListMatkulIcon />
                <Text fontWeight="semibold" fontSize="14px">
                  List Matkul
                </Text>
              </ViewListContainer>
              <ViewCalendarContainer
                isActive={isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(true)}
                mode={theme}
              >
                <CalendarIcon width={20} />
                <Text fontWeight="semibold" fontSize="14px">
                  Kalender Matkul
                </Text>
              </ViewCalendarContainer>
            </ViewToggleContainer>
          </>
        )}

        {isDisplayTimetable ? (
          <Schedule
            width="100%"
            pxPerMinute={isMobile ? 0.7 : 0.9}
            schedule={schedule}
            startHour={7}
            endHour={21}
            showHeader
            showLabel
            showRoom
          />
        ) : (
          <ScheduleList
            formattedSchedule={formattedSchedule}
            totalCredits={totalCredits}
          />
        )}

        <div style={{ overflow: "hidden", minWidth: "1440px", height: "0" }}>
          <div ref={refs}>
            <DownloadRef
              pxPerMinute={0.9}
              schedule={schedule}
              startHour={7}
              endHour={21}
              showHeader
              showLabel
              showRoom
              formattedSchedule={formattedSchedule}
            />
          </div>
        </div>
      </MainContainer>

      <GoogleCalendarModal
        isOpen={googleCalendarModal.isOpen}
        onClose={googleCalendarModal.onClose}
        schedule={schedule}
        generateICalendarFile={generateICalendarFile}
      />
    </>
  );
}

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

const MainContainer = styled.div`
  padding: 0px !important;
  margin: -56px -24px 0;

  @media (min-width: 900px) {
    margin: -36px -80px 0;
  }
`;

const Container = styled.div`
  padding: 24px 24px 0px;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 32px 80px 0px;

    & > :nth-child(1) {
      flex-grow: 1;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
  justify-content: space-between;
  margin-right: -8px;

  @media (min-width: 900px) {
    margin-right: 0px;
    position: relative;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 0;

  ${(props) =>
    props.isAuthenticated ? "visibility: visible;" : "visibility: hidden;"}

  @media (min-width: 900px) {
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const ButtonContainer = styled.div`
  align-items: center;
  margin-top: 24px;
  display: flex;
  justify-content: center;

  a {
    ${(props) =>
      props.isAuthenticated ? "visibility: visible;" : "visibility: hidden;"}
    width: auto;
  }

  @media (min-width: 900px) {
    margin-top: 0px;
    margin-left: auto;
    justify-content: flex-end;
  }
`;

const ScheduleNameEditable = styled.div`
  p {
    text-align: left;
    margin-top: 4px;
    font-size: 12px;
  }

  @media (min-width: 900px) {
    p {
      font-size: 14px;
    }
  }
`;

const ScheduleName = styled.div`
  font-size: 32px;
  color: ${(props) =>
    props.mode === "light"
      ? props.theme.color.secondaryMineShaft
      : props.theme.color.darkWhite};
`;

const ViewToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  border-radius: 1em;
  justify-content: center;
  padding: 24px 24px 28px;

  @media (min-width: 900px) {
    padding: 40px 80px ;
`;

const ViewListContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  column-gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.mode === "light"
      ? props.theme.color.primaryWhite
      : props.theme.color.darkBlack};
  padding: 10px 1rem;
  border-top-left-radius: 1em;
  border-bottom-left-radius: 1em;
  border-left: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};
  svg,
  p {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
`;

const ViewCalendarContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  column-gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.mode === "light"
      ? props.theme.color.primaryWhite
      : props.theme.color.darkBlack};
  padding: 10px 1rem;
  border-top-right-radius: 1em;
  border-bottom-right-radius: 1em;
  border-right: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};

  svg,
  p {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
`;

export default ViewSchedule;
