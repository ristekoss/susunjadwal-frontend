import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useHistory } from "react-router";
import {
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  useDisclosure,
  PopoverBody,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { getSchedules } from "services/api";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import Schedule from "containers/ViewSchedule/Schedule";
import { decodeHtmlEntity } from 'utils/string';
import { BauhausSide } from 'components/Bauhaus';
import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";
import ScheduleDetail from "./ScheduleDetail";
import { deleteSchedule } from "services/api";
import { SuccessToast } from "components/Toast";
import getFormattedSchedule from "utils/schedule";
import MoreOptions from "components/MoreOptions/MoreOptions";
import { theme } from "styles/StyledTheme";
import useDownloadCalendar from "hooks/useDownloadCalendar";

const ScheduleList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState("");
  const [schedules, setSchedules] = useState();

  const { generateICalendarFile } = useDownloadCalendar();

  useEffect(() => {
    const fetchSchedules = async () => {
      dispatch(setLoading(true));
      const {
        data: { user_schedules },
      } = await makeAtLeastMs(getSchedules(auth.userId), 1000);
      setSchedules(user_schedules);
      dispatch(setLoading(false));
    };

    fetchSchedules();
  }, [dispatch, auth]);
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
  const showAlertCopy = () => {
    ReactGA.event({
      category: "Bagikan Jadwal",
      action: "Copied a schedule's URL",
    });
    SuccessToast("Link berhasil disalin!", isMobile);
  };
  const handleClickEditJadwal = (idJadwal) => {
    history.push(`/edit/${idJadwal}`);
  };

  const moreOptionsProps = ({ schedule }) => {
    return {
      items: [
        {
          node: (
            <CopyToClipboard
              text={`${window.location.href}/${schedule.id}`}
              onCopy={showAlertCopy}
            >
              <Button
                variant="unstyled"
                style={{ textAlign: "left", borderRadius: 0 }}
              >
                <PopoverBody>Bagikan Jadwal</PopoverBody>
              </Button>
            </CopyToClipboard>
          ),
        },
        {
          text: "Download Jadwal",
          props: {
            onClick: () => generateICalendarFile(schedule),
          },
        },
        {
          text: "Edit Jadwal",
          props: {
            onClick: () => handleClickEditJadwal(schedule.id),
          },
        },
        {
          text: "Hapus Jadwal",
          props: {
            style: {
              color: theme.color.stateError,
            },
            onClick: () => showDialogDelete(schedule.id),
          },
        },
      ],
    };
  };
  return (
    <Container>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>Apakah kamu yakin ingin menghapus jadwal?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose} variant="outline">
              Batal
            </Button>
            <Button
              onClick={() => confirmDeleteSchedule(selectedId)}
              variant="danger"
            >
              Hapus
            </Button>
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
          <PageTitle mobile={isMobile}>Daftar Jadwal</PageTitle>
        </>
      )}

      {!!schedules?.length ? (
        <CardContainer>
          {schedules?.map((schedule, idx) => {
            return (
              <ScheduleDetail
                schedule={schedule}
                idx={idx}
                key={schedule.id}
                alertCopy={showAlertCopy}
                showModal={showDialogDelete}
                editSchedule={handleClickEditJadwal}
              />
            );
          })}
        </CardContainer>
      ) : (
        <>
          {isMobile ? (
            <AssetBauhaus
              isMobile={isMobile}
              src={BauhausMobile}
              alt="bauhaus-sm"
            />
          ) : (
            <AssetBauhaus src={BauhausDesktop} alt="bauhaus-lg" />
          )}
          <Box pt="90px" mb={{ base: 16, md: "160px" }}>
            <div
              style={{ textAlign: isMobile ? "center" : "left", width: "100%" }}
            >
              <PageTitleNoSchedule mobile={isMobile}>
                Daftar Jadwal
              </PageTitleNoSchedule>
              <PageInfo mobile={isMobile}>
                Anda belum pernah membuat jadwal. Mulai susun jadwal anda
                sekarang!
              </PageInfo>
              <Link to={`/susun`}>
                <Button
                  height={{ base: "44px", md: "57px" }}
                  width={{ base: "137px", md: "194px" }}
                  ml={{ md: 12 }}
                  fontSize={{ base: "14px", md: "18px" }}
                >
                  Buat Jadwal
                </Button>
              </Link>
            </div>
          </Box>
        </>
      )}
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
  color: #5038bc;
  @media (min-width: 900px) {
    text-align: left;
  }
`;

const PageTitleNoSchedule = styled.h1`
  font-size: ${({ mobile }) => (mobile ? "50px" : "64px")};
  font-weight: bold;
  color: #5038bc;
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 16px 48px")};
`;

const PageInfo = styled.h2`
  font-size: ${({ mobile }) => (mobile ? "14px" : "18px")};
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 48px 48px")};
  color: #333333;
`;

const CardContainer = styled.div`
  padding: ${(props) => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  width: 100%;
  background-color: #ffffff;
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
