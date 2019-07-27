import React, { useState } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import Button from "components/Button";
import { postSaveSchedule } from "services/api";
import { isScheduleConflict } from "./utils";
import TrashIcon from "assets/Trash.png";
import TrashWhiteIcon from "assets/TrashWhite.png";
import Agenda from "./Agenda";
import { setLoading } from "redux/modules/appState";
import { removeSchedule, clearSchedule } from "redux/modules/schedules";

function transformSchedules(schedules) {
  return schedules
    .map(schedule =>
      schedule.schedule_items.map(item => ({
        ...item,
        name: schedule.name
      }))
    )
    .reduce((prev, now) => [...prev, ...now], []);
}

function SelectedCourses({ history }) {
  const schedules = useSelector(state => state.schedules);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [isAgendaModalVisible, setAgendaModalVisibility] = useState(false);
  const totalCredits = schedules.reduce((prev, { credit }) => prev + credit, 0);

  async function saveSchedule() {
    dispatch(setLoading(true));
    try {
      const {
        data: { id: scheduleId }
      } = await postSaveSchedule(auth.userId, transformSchedules(schedules));
      dispatch(clearSchedule());
      history.push(`/jadwal/${scheduleId}`);
    } catch (e) {
      // TODO: handle error
    }
    setTimeout(() => dispatch(setLoading(false)), 1000);
  }

  let isConflict = false;
  const items = schedules.map((schedule, idx) => {
    const isCurrentScheduleConflict = isScheduleConflict(schedules, schedule);
    isConflict = isConflict || isCurrentScheduleConflict;

    const classesTimes = schedule.schedule_items.map((item, index) => (
      <span key={index}>
        - {item.day}, {item.start}-{item.end}
      </span>
    ));

    return (
      <TableContentRow key={idx} inverted={isCurrentScheduleConflict}>
        <div className="courseName">{schedule.name}</div>
        <div>{classesTimes}</div>
        <div className="small-2 columns">
          <span>{schedule.credit}</span>
        </div>
        <div className="small-1 columns text-right">
          <DeleteButton
            inverted={isCurrentScheduleConflict}
            onClick={() => dispatch(removeSchedule(schedule))}
          />
        </div>
      </TableContentRow>
    );
  });

  return (
    <React.Fragment>
      <Agenda
        visible={isAgendaModalVisible}
        onClose={() => setAgendaModalVisibility(false)}
      />
      <Container>
        <h3>Kelas Pilihan</h3>
        <TableHeader>
          <div>Kelas</div>
          <div>Waktu</div>
          <div>
            <span>SKS</span>
          </div>
        </TableHeader>
        {items}
        <TableCreditSum>
          <div>
            <span>Total SKS</span>
          </div>
          <div>
            <span>{totalCredits}</span>
          </div>
        </TableCreditSum>
        {isConflict && (
          <MessageContainer>
            <p>Ada konflik jadwal, perbaiki terlebih dahulu!</p>
          </MessageContainer>
        )}
        <Button
          intent="secondary"
          onClick={() => setAgendaModalVisibility(true)}
        >
          Tambah Agenda
        </Button>
        <Button
          onClick={saveSchedule}
          disabled={isConflict || totalCredits > 24 || schedules.length === 0}
        >
          Simpan Jadwal
        </Button>
      </Container>
    </React.Fragment>
  );
}

export default withRouter(SelectedCourses);

const Container = styled.div`
  width: 100%;
  color: white;

  h3 {
    font-size: 1.5rem;
    color: #ce9d4d;
    font-weight: bold;
    margin-bottom: 16px;
  }

  > button {
    margin-top: 16px;
  }

  padding-bottom: 32px;
`;

const TableHeader = styled.div`
  display: flex;
  border-bottom: 2px solid #308077;
  font-weight: bold;
  align-items: center;

  div {
    padding: 0.5rem 0;
    &:nth-child(1) {
      flex: 4;
    }
    &:nth-child(2) {
      flex: 5;
    }
    &:nth-child(3) {
      flex: 3;
      span {
        margin-left: 12px;
      }
    }
  }
`;

const TableContentRow = styled.div`
  display: flex;
  font-size: 0.75rem;
  background-color: ${({ inverted }) => (inverted ? "#C74550" : "#0000")};
  min-height: 70px;

  div {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;

    &:nth-child(1) {
      flex: 4;
    }
    &:nth-child(2) {
      flex: 5;
    }
    &:nth-child(3) {
      flex: 2;
      font-size: 16px;

      span {
        margin-left: 12px;
      }
    }
    &:nth-child(4) {
      flex: 1;
    }
  }
`;

const TableCreditSum = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #308077;
  padding: 4px 12px;
  margin-top: 8px;

  div {
    &:nth-child(1) {
      flex: 9;
      display: flex;
      justify-content: flex-end;
      margin-right: 16px;
    }
    &:nth-child(2) {
      span {
        margin-left: 12px;
      }
      flex: 3;
    }
  }
`;
const DeleteButton = styled.button`
  background: url(${({ inverted }) => (inverted ? TrashWhiteIcon : TrashIcon)});
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  width: 80%;
  align-self: center;
`;

const MessageContainer = styled.div`
  background-color: #c74550;
  font-size: 0.75rem;
  padding: 4px;
  text-align: center;
`;
