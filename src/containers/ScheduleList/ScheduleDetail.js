import React, { useState } from "react";
import ReactGA from "react-ga";

import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { CalendarIcon, ViewListIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { decodeHtmlEntity } from "utils/string";
import getFormattedSchedule from "utils/schedule";
import { SuccessToast } from "components/Toast";
import EditIcon from "assets/EditSchedule/EditIcon";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";
import ScheduleList from "containers/ViewSchedule/ScheduleList";
import Schedule from "containers/ViewSchedule/Schedule";
import { deleteSchedule } from "services/api";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

const ScheduleDetail = (schedule, idx) => {
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const [selectedId, setSelectedId] = useState("");
  const isMobile = useSelector((state) => state.appState.isMobile);
  const [isDisplayTimetable, setIsDisplayTimetable] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const [formattedSchedule, totalCredits] = getFormattedSchedule(
    schedule.schedule,
  );

  const convertDate = (date) => {
    const dateNew = new Date(date);
    return `${dateNew.getDate()}/${
      dateNew.getMonth() + 1
    }/${dateNew.getFullYear()}`;
  };
  const showAlertCopy = () => {
    ReactGA.event({
      category: "Bagikan Jadwal",
      action: "Copied a schedule's URL",
    });
    SuccessToast("Link berhasil disalin!", isMobile);
  };
  const performDeleteSchedule = async (userId, scheduleId) => {
    ReactGA.event({
      category: "Hapus Jadwal",
      action: "Deleted a schedule",
    });
    dispatch(setLoading(true));
    onClose();
    await makeAtLeastMs(deleteSchedule(userId, scheduleId), 1000);
    window.location.reload();
  };
  const confirmDeleteSchedule = (scheduleId) => {
    performDeleteSchedule(auth.userId, scheduleId);
  };
  const showDialogDelete = (id) => {
    setSelectedId(id);
    onOpen();
  };
  const handleClickEditJadwal = (idJadwal) => {
    history.push(`/edit/${idJadwal}`);
  };

  return (
    <>
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
      <Card key={`${schedule.schedule.name}-${idx}`}>
        <div className="headerInfo">
          <Link to={`/jadwal/${schedule.schedule.id}`}>
            <h2>{decodeHtmlEntity(schedule.schedule.name) || "Untitled"}</h2>
            <h4>
              Dibuat pada {convertDate(schedule.schedule.created_at)} • SKS
            </h4>
          </Link>
          <CardActionContainer>
            <CopyToClipboard
              text={`${window.location.href}/${schedule.schedule.id}`}
              onCopy={showAlertCopy}
            >
              <ImageButton src={clipboardImg} />
            </CopyToClipboard>
            <ImageButton
              src={deleteImg}
              onClick={() => showDialogDelete(schedule.schedule.id)}
            />
            <EditIcon
              className="editIcon"
              onClick={() => handleClickEditJadwal(schedule.schedule.id)}
            />
            <ViewToggleContainer>
              <ViewListContainer
                isActive={!isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(false)}
              >
                <ViewListIcon width={20} />
              </ViewListContainer>

              <ViewCalendarContainer
                isActive={isDisplayTimetable}
                onClick={() => setIsDisplayTimetable(true)}
              >
                <CalendarIcon width={20} />
              </ViewCalendarContainer>
            </ViewToggleContainer>
          </CardActionContainer>
        </div>
        {isDisplayTimetable ? (
          <Schedule
            startHour={7}
            endHour={21}
            schedule={schedule.schedule}
            pxPerMinute={isMobile ? 0.3 : 0.7}
            width="100%"
            showRoom
          />
        ) : (
          <ScheduleList
            formattedSchedule={formattedSchedule}
            totalCredits={totalCredits}
          />
        )}
      </Card>
    </>
  );
};
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

const CardActionContainer = styled.div`
  display: flex;
  flex-direction: "row";
  justify-content: center;
  align-items: center;
  .editIcon {
    margin-left: 8px;
    cursor: pointer;
  }
`;

const ImageButton = styled.button`
  background: url(${({ src }) => src}) no-repeat;
  cursor: pointer;
  height: 24px;
  width: 24px;
  border: none;
  & + & {
    margin-left: 8px;
  }
`;

const ViewToggleContainer = styled.div`
  display: flex;
  margin-left: 5%
  flex-direction: row;
  cursor: pointer;
  border-radius: 1em;
`;

const ViewListContainer = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.theme.color.primaryWhite};
  padding: 10px 1rem;
  border-top-left-radius: 1em;
  border-bottom-left-radius: 1em;
  border-left: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};
  svg {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
`;

const ViewCalendarContainer = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.color.primaryPurple
      : props.theme.color.primaryWhite};
  padding: 10px 1rem;
  border-top-right-radius: 1em;
  border-bottom-right-radius: 1em;
  border-right: 1px solid ${(props) => props.theme.color.primaryPurple};
  border-top: 2px solid ${(props) => props.theme.color.primaryPurple};
  border-bottom: 2px solid ${(props) => props.theme.color.primaryPurple};

  svg {
    color: ${(props) =>
      props.isActive
        ? props.theme.color.primaryWhite
        : props.theme.color.primaryPurple};
  }
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
export default ScheduleDetail;
