import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";

import {
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { useHistory } from "react-router";

import { getSchedules, deleteSchedule } from "services/api";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import Schedule from "containers/ViewSchedule/Schedule";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";
import { decodeHtmlEntity } from "utils/string";
import EditIcon from "assets/EditSchedule/EditIcon";
import { BauhausSide } from "components/Bauhaus";
import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";
import { SuccessToast } from "components/Toast";
import Dropdown from "components/Dropdown";
import getFormattedSchedule from "utils/schedule";

const ScheduleList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedId, setSelectedId] = useState("");
  const [schedules, setSchedules] = useState();

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

  const convertDate = (date) => {
    const dateNew = new Date(date);
    return `${dateNew.getDate()}/${
      dateNew.getMonth() + 1
    }/${dateNew.getFullYear()}`;
  };

  const showDialogDelete = (id) => {
    setSelectedId(id);
    onOpen();
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

      {schedules && schedules.length > 0 ? (
        <>
          <BauhausSide />
          <PageTitle mobile={isMobile}>Daftar Jadwal</PageTitle>
        </>
      ) : (
        ""
      )}

      {schedules && schedules.length > 0 ? (
        <CardContainer>
          {schedules.map((schedule, idx) => {
            const [, totalCredits] = getFormattedSchedule(schedule);

            return (
              <Card key={`${schedule.name}-${idx}`}>
                <div className="headerInfo">
                  <div>
                    <div style={{ display: "flex", gap: "13px" }}>
                      <Link to={`/jadwal/${schedule.id}`}>
                        <h2>
                          {schedule.name
                            ? decodeHtmlEntity(schedule.name)
                            : "Untitled"}
                        </h2>
                      </Link>
                      <Dropdown
                        DropdownItems={[
                          {
                            text: "Bagikan Jadwal",
                            icon: <ImageButton src={clipboardImg} />,
                            action: showAlertCopy,
                          },

                          {
                            text: "Edit Jadwal",
                            icon: <EditIcon style={{ marginRight: "6px" }} />,
                            action: () => handleClickEditJadwal(schedule.id),
                          },
                          {
                            text: "Delete Jadwal",
                            icon: <ImageButton src={deleteImg} />,
                            action: () => showDialogDelete(schedule.id),
                          },
                        ]}
                      ></Dropdown>
                    </div>

                    <h4>
                      Dibuat pada {convertDate(schedule.created_at)} •{" "}
                      {totalCredits} SKS
                    </h4>
                  </div>
                </div>
                <Schedule
                  startHour={7}
                  endHour={21}
                  schedule={schedule}
                  pxPerMinute={isMobile ? 0.3 : 0.7}
                  width="100%"
                  showRoom
                />
              </Card>
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

const Card = styled.div`
  border: 0.05px solid #e5e5e5;
  border-radius: 8px;
  h2 {
    color: #333333;
    font-weight: bold;
    font-size: 18px;
  }
  h4 {
    color: #333333;
    font-size: 12px;
  }
  .headerInfo {
    padding: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #f5f5f5;
    border-radius: 8px 8px 0 0;
  }
  ${(props) =>
    !props.theme.mobile &&
    css`
      width: 49%;
      &:nth-child(even) {
        margin-left: 2%;
      }
    `}
  margin-bottom: 32px;

  @media (min-width: 900px) {
    h2 {
      font-size: 24px;
    }
    h4 {
      font-size: 14px;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: ${(props) => (props.theme.mobile ? "column" : "row")};
  padding: ${(props) => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  background-color: #ffffff;
`;

const ImageButton = styled.button`
  background: url(${({ src }) => src}) no-repeat;
  cursor: pointer;
  height: 24px;
  width: 24px;
  border: none;
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

export default ScheduleList;
