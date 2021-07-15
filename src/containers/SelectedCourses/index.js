import { useSelector, useDispatch } from "react-redux";
import { Button } from "@chakra-ui/react";
import { withRouter } from "react-router";
import React, { useState } from "react";
import styled from "styled-components";

import { removeSchedule, clearSchedule } from "redux/modules/schedules";
import { setLoading } from "redux/modules/appState";
import { putUpdateSchedule } from "services/api";
import { postSaveSchedule } from "services/api";
import { deleteSchedule } from "services/api";
import { makeAtLeastMs } from "utils/promise";

import { isScheduleConflict } from "./utils";

import TrashIcon from "assets/Trash.svg";

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

function SelectedCourses({ history, scheduleId, isEditing }) {
  const schedules = useSelector(state => state.schedules);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

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

  async function updateSchedule() {
    dispatch(setLoading(true));
    try {
      const { data } = await makeAtLeastMs(
        putUpdateSchedule(auth.userId, scheduleId, transformSchedules(schedules)),
        1000
      );
      dispatch(clearSchedule());
      history.push(`/jadwal/${data.user_schedule.id}`);
    } catch (e) {
      // TODO: handle error
    }
    setTimeout(() => dispatch(setLoading(false)), 1000);
  }

  const handleDeleteSchedule = async () => {
    dispatch(setLoading(true));
    await makeAtLeastMs(deleteSchedule(auth.userId, scheduleId), 1000);
    dispatch(clearSchedule());
    history.push("/jadwal")
    setTimeout(() => dispatch(setLoading(false)), 1000);
  }

  let isConflict = false;

  const items = schedules.map((schedule, idx) => {
    const isCurrentScheduleConflict = isScheduleConflict(schedules, schedule);
    isConflict = isConflict || isCurrentScheduleConflict;

    const classesTimes = schedule.schedule_items.map((item, index) => (
      <li key={index}>
        {item.day}, {item.start}-{item.end}
      </li>
    ));

    return (
      <TableContentRow key={idx} inverted={isCurrentScheduleConflict}>
        <div className="courseName">{schedule.name}</div>
        <div><ul>{classesTimes}</ul></div>
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
            <p>Ada jadwal yang bertabrakan. Perbaiki terlebih dahulu sebelum menyimpan.</p>
          </MessageContainer>
        )}

        {(!isConflict && totalCredits > 24) && (
          <MessageContainer>
            <p>Jumlah SKS yang diambil melebihi batas maksimum (24 SKS).</p>
          </MessageContainer>
        )}

        <Button
          onClick={() => !isEditing
            ? saveSchedule()
            : schedules.length === 0
              ? handleDeleteSchedule()
              : updateSchedule()}
          disabled={isConflict || totalCredits > 24 || schedules.length === 0}
          intent={schedules.length === 0 && isEditing && 'danger'}
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
  color: #333333;

  h3 {
    color: ${props => props.theme.color.primaryPurple};
    margin-bottom: 16px;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }

  > button {
    margin-top: 16px;
    width: 100%;
  }

  button:disabled,
  button[disabled] {
    background: #BDBDBD;
    opacity: 100%;
  }

  button:disabled:hover,
  button[disabled]:hover {
    background: rgba(189, 189, 189, 0.8);
  }

  padding-bottom: 32px;
`;

const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #BDBDBD;
  align-items: center;
  font-weight: 600;

  div {
    padding: 0.5rem 0;
    &:nth-child(1) {
      flex: 4;
      margin-left: 1rem;
    }
    &:nth-child(2) {
      flex: 5;
    }
    &:nth-child(3) {
      flex: 3;
    }
  }
`;

const TableContentRow = styled.div`
  :nth-child(odd) {
    background: ${({ inverted }) => (
      inverted
        ? "rgba(235, 87, 87, 0.2)"
        : props => props.theme.color.primaryWhite
    )};
  }

  :nth-child(even) {
    background: ${({ inverted }) => (
      inverted
        ? "rgba(235, 87, 87, 0.2)"
        : "#F5F5F5"
    )};
  }


  display: flex;
  min-height: 70px;
  font-size: 0.75rem;

  div {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;

    ul {
      margin-left: 15%;
      text-align: left;
    }

    li {
      list-style-type: none;
      position: relative;
    }

    li::before {
      content: '•';
      position: absolute;
      left: -12px;
      font-size: 16px;
    }


    &:nth-child(1) {
      flex: 4;
      margin-left: 1rem;
    }
    &:nth-child(2) {
      flex: 5;
    }
    &:nth-child(3) {
      flex: 2;
      font-size: 16px;

      span {
        margin-left: 18px;
      }
    }
    &:nth-child(4) {
      flex: 1;
      margin-right: 6px;
    }
  }
`;

const TableCreditSum = styled.div`
  background-color: #333333;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  color: white;

  padding: 4px 12px;
  margin-top: 8px;
  display: flex;

  div {
    &:nth-child(1) {
      flex: 9;
      display: flex;
      justify-content: flex-end;
      margin-right: 20%;
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
  background: url(${TrashIcon});
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  width: 80%;
  align-self: center;
`;

const MessageContainer = styled.div`
  margin: 16px -5px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #E91515;

  @media (min-width: 900px) {
    margin: 18px -5px 0px;
    font-size: 14px;
  }
`;
