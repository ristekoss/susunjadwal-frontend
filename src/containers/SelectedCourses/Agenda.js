import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import Button from "components/Button";
import { addSchedule } from "redux/modules/schedules";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function Agenda({ visible, onClose }) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [day, setDay] = useState("Senin");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [room, setRoom] = useState("");
  const [agendaValid, setAgendaValid] = useState(null);

  function verifyAgenda() {
    const nameCheck = name !== "" && name !== null;
    const dayCheck = DAYS.indexOf(day) !== -1;

    // 07.00 - 21.00
    const timeChecker = /^(0[7-9]|1[0-9]|2[0-1])\.([0-5][0-9])$/;
    const startCheck = timeChecker.test(start);
    const endCheck = timeChecker.test(end);

    const timeValidCheck =
      startCheck && endCheck && parseFloat(start) < parseFloat(end);
    const roomCheck = room !== "" && room !== null;

    return {
      nameCheck,
      dayCheck,
      startCheck,
      endCheck,
      roomCheck,
      timeValidCheck
    };
  }

  function addAgenda() {
    const check = verifyAgenda();
    const valid = Object.keys(check).reduce(
      (flag, key) => flag && check[key],
      true
    );

    if (valid) {
      dispatch(
        addSchedule({
          parentName: `__agenda-${name}`,
          name,
          credit: 0,
          schedule_items: [{ start, end, room, day }]
        })
      );
      onClose();
    } else {
      setAgendaValid({ ...check });
    }
  }

  return (
    <Container visible={visible}>
      <FormContainer>
        <h1>Tambah Agenda</h1>
        <input
          type="text"
          placeholder="Nama Agenda"
          value={name}
          maxLength={20}
          onChange={evt => setName(evt.target.value)}
        />
        {agendaValid && !agendaValid.nameCheck && (
          <ErrorLine>Nama agenda tidak boleh kosong</ErrorLine>
        )}

        <select value={day} onChange={evt => setDay(evt.target.value)}>
          <option value="Senin">Senin</option>
          <option value="Selasa">Selasa</option>
          <option value="Rabu">Rabu</option>
          <option value="Kamis">Kamis</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
        </select>
        {agendaValid && !agendaValid.dayCheck && (
          <ErrorLine>Hari salah</ErrorLine>
        )}

        <input
          type="text"
          placeholder="Jam Mulai, format: HH.MM"
          value={start}
          onChange={evt => setStart(evt.target.value)}
          pattern="\d\d.\d\d"
        />
        {agendaValid && !agendaValid.startCheck && (
          <ErrorLine>
            Format jam mulai salah, seharusnya HH.MM, contoh: 12.30 (min 07.00)
          </ErrorLine>
        )}
        {agendaValid &&
          !agendaValid.timeValidCheck &&
          agendaValid.startCheck && (
            <ErrorLine>Jam mulai harus lebih dahulu dari jam akhir</ErrorLine>
          )}

        <input
          type="text"
          placeholder="Jam Selesai, format: HH.MM"
          value={end}
          onChange={evt => setEnd(evt.target.value)}
        />
        {agendaValid && !agendaValid.endCheck && (
          <ErrorLine>
            Format jam selesai salah, seharusnya HH.MM, contoh: 12.30 (max
            21.00)
          </ErrorLine>
        )}
        {agendaValid && !agendaValid.timeValidCheck && agendaValid.endCheck && (
          <ErrorLine>Jam mulai harus lebih dahulu dari jam akhir</ErrorLine>
        )}

        <input
          type="text"
          placeholder="Ruangan"
          value={room}
          onChange={evt => setRoom(evt.target.value)}
        />
        {agendaValid && !agendaValid.roomCheck && (
          <ErrorLine>Ruangan tidak boleh kosong</ErrorLine>
        )}

        <ButtonWrapper>
          <Button width="100px" onClick={onClose} intent="secondary">
            BATAL
          </Button>
          <Button width="100px" onClick={addAgenda}>
            SIMPAN
          </Button>
        </ButtonWrapper>
      </FormContainer>
    </Container>
  );
}

export default Agenda;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

const ErrorLine = styled.div`
  color: #ffffff;
  background: #c74550;
  margin-bottom: 16px;
  padding: 2px 2px;
  text-align: center;
  font-size: 1rem;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  button + button {
    margin-left: 16px;
  }
`;

const FormContainer = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  background: #fff;
  padding: 2rem;

  display: flex;
  align-items: center;
  flex-direction: column;

  color: black;

  h1 {
    font-size: 16px;
    color: black;
    font-weight: bold;
    text-transform: uppercase;
  }

  input,
  select {
    background-color: white;
    width: 100%;
    padding: 8px 16px;
    border: none;
    border-bottom: 2px solid #ce9d4d;
    height: 40px;
    margin-bottom: 16px;
  }
`;
