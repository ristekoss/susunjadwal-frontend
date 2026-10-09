import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Image,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import { addSchedule } from "redux/modules/schedules";
import { timeToMinutes } from "utils/schedule";
import infoCircleIcon from "assets/info-circle.svg";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function padZero(num) {
  return String(num).padStart(2, "0");
}

function parseTimeToParts(timeStr) {
  if (!timeStr) return { hour: 9, minute: 0 };
  const parts = timeStr.split(/[:.]/).map((p) => parseInt(p, 10));
  return {
    hour: isNaN(parts[0]) ? 9 : parts[0],
    minute: isNaN(parts[1]) ? 0 : parts[1],
  };
}

function formatTimeString(hour, minute) {
  return `${padZero(hour)}.${padZero(minute)}`;
}

function checkIfTwoScheduleConflict(schedule1, schedule2) {
  for (const item1 of schedule1.schedule_items) {
    const start1 = timeToMinutes(item1.start);
    const end1 = timeToMinutes(item1.end);

    for (const item2 of schedule2.schedule_items) {
      if (item1.day !== item2.day) continue;
      const start2 = timeToMinutes(item2.start);
      const end2 = timeToMinutes(item2.end);

      const noOverlap = end1 <= start2 || end2 <= start1;
      if (!noOverlap) {
        return true;
      }
    }
  }
  return false;
}

function TimePickerDropdown({
  value,
  onChange,
  mode,
  minHour = 7,
  maxHour = 21,
}) {
  const { hour, minute } = parseTimeToParts(value);

  const incrementHour = () => {
    const nextHour = hour >= maxHour ? minHour : hour + 1;
    onChange(formatTimeString(nextHour, minute));
  };

  const decrementHour = () => {
    const prevHour = hour <= minHour ? maxHour : hour - 1;
    onChange(formatTimeString(prevHour, minute));
  };

  const incrementMinute = () => {
    let nextMin = minute + 15;
    if (nextMin >= 60) nextMin = 0;
    onChange(formatTimeString(hour, nextMin));
  };

  const decrementMinute = () => {
    let prevMin = minute - 15;
    if (prevMin < 0) prevMin = 45;
    onChange(formatTimeString(hour, prevMin));
  };

  return (
    <TimePickerContainer mode={mode}>
      <Column>
        <ArrowBtn type="button" onClick={incrementHour} mode={mode}>
          <ChevronUpIcon w={6} h={6} />
        </ArrowBtn>
        <TimeVal mode={mode}>{hour}</TimeVal>
        <ArrowBtn type="button" onClick={decrementHour} mode={mode}>
          <ChevronDownIcon w={6} h={6} />
        </ArrowBtn>
      </Column>

      <TimeSeparator mode={mode}>:</TimeSeparator>

      <Column>
        <ArrowBtn type="button" onClick={incrementMinute} mode={mode}>
          <ChevronUpIcon w={6} h={6} />
        </ArrowBtn>
        <TimeVal mode={mode}>{padZero(minute)}</TimeVal>
        <ArrowBtn type="button" onClick={decrementMinute} mode={mode}>
          <ChevronDownIcon w={6} h={6} />
        </ArrowBtn>
      </Column>
    </TimePickerContainer>
  );
}

function CustomizeJadwalModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules);
  const theme = useColorModeValue("light", "dark");

  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState(["Senin"]);
  const [startTime, setStartTime] = useState("09.15");
  const [endTime, setEndTime] = useState("10.45");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const candidateSchedule = useMemo(() => {
    if (!name || selectedDays.length === 0 || !startTime || !endTime) {
      return null;
    }
    return {
      name,
      parentName: `__custom-${name}`,
      schedule_items: selectedDays.map((d) => ({
        day: d,
        start: startTime,
        end: endTime,
        room: location,
        name,
        course_name: name,
      })),
    };
  }, [name, selectedDays, startTime, endTime, location]);

  const conflictingCourse = useMemo(() => {
    if (!candidateSchedule) return null;
    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(endTime);
    if (isNaN(startM) || isNaN(endM) || startM >= endM) return null;

    const conflict = schedules.find((other) =>
      checkIfTwoScheduleConflict(candidateSchedule, other),
    );
    if (!conflict) return null;
    return conflict.name || conflict.parentName || "Jadwal Lain";
  }, [candidateSchedule, schedules, startTime, endTime]);

  const isTimeOrderValid = useMemo(() => {
    if (!startTime || !endTime) return true;
    return timeToMinutes(startTime) < timeToMinutes(endTime);
  }, [startTime, endTime]);

  const isFormValid =
    name.trim().length > 0 &&
    selectedDays.length > 0 &&
    startTime &&
    endTime &&
    isTimeOrderValid &&
    !conflictingCourse;

  const handleSave = () => {
    setHasInteracted(true);
    if (!isFormValid) return;

    const customId = Date.now();
    const newSchedule = {
      parentName: `__custom-${customId}`,
      name: name.trim(),
      credit: 0,
      isCustom: true,
      description: description.trim(),
      room: location.trim(),
      lecturer: [description.trim() || "-"],
      schedule_items: selectedDays.map((d) => ({
        day: d,
        start: startTime,
        end: endTime,
        room: location.trim() || "-",
        name: name.trim(),
        course_name: name.trim(),
        lecturer: [description.trim() || "-"],
        sks: 0,
      })),
    };

    dispatch(addSchedule(newSchedule));
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setSelectedDays(["Senin"]);
    setStartTime("09.15");
    setEndTime("10.45");
    setDescription("");
    setLocation("");
    setHasInteracted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <StyledModalContent mode={theme}>
        <ModalBody p="0">
          <MobileHandle mode={theme} />
          <ModalTitle mode={theme}>Customize Jadwal</ModalTitle>

          <ScrollBody>
            {/* Nama Jadwal */}
            <FormGroup>
              <Label mode={theme}>
                Nama Jadwal <Required>*</Required>
              </Label>
              <TextInput
                type="text"
                placeholder="Ketik nama jadwal di sini"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mode={theme}
              />
              {hasInteracted && !name.trim() && (
                <ErrorText>Nama jadwal wajib diisi</ErrorText>
              )}
            </FormGroup>

            {/* Hari Jadwal */}
            <FormGroup>
              <Label mode={theme}>
                Hari Jadwal <Required>*</Required>
              </Label>
              <ChipsGrid>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <DayChip
                      key={day}
                      type="button"
                      selected={isSelected}
                      onClick={() => toggleDay(day)}
                      mode={theme}
                    >
                      {day}
                    </DayChip>
                  );
                })}
              </ChipsGrid>
            </FormGroup>

            {/* Waktu Jadwal */}
            <FormGroup>
              <Label mode={theme}>
                Waktu Jadwal <Required>*</Required>
              </Label>
              <TimeRow>
                <Popover placement="bottom-start" closeOnBlur={true}>
                  <PopoverTrigger>
                    <TimeChip type="button" mode={theme}>
                      {startTime || "Waktu Mulai"}
                    </TimeChip>
                  </PopoverTrigger>
                  <PopoverContent w="auto" border="none" bg="transparent" p="0">
                    <PopoverBody p="0">
                      <TimePickerDropdown
                        value={startTime}
                        onChange={setStartTime}
                        mode={theme}
                      />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>

                <TimeSeparatorText mode={theme}>-</TimeSeparatorText>

                <Popover placement="bottom-start" closeOnBlur={true}>
                  <PopoverTrigger>
                    <TimeChip type="button" mode={theme}>
                      {endTime || "Waktu Selesai"}
                    </TimeChip>
                  </PopoverTrigger>
                  <PopoverContent w="auto" border="none" bg="transparent" p="0">
                    <PopoverBody p="0">
                      <TimePickerDropdown
                        value={endTime}
                        onChange={setEndTime}
                        mode={theme}
                      />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </TimeRow>
              {!isTimeOrderValid && (
                <ErrorText>Waktu selesai harus setelah waktu mulai</ErrorText>
              )}
            </FormGroup>

            {/* Conflict Alert */}
            {conflictingCourse && (
              <ConflictAlertBox mode={theme}>
                <Image src={infoCircleIcon} alt="alert" w="24px" h="24px" />
                <ConflictTextCol>
                  <ConflictTitle mode={theme}>Jadwal bentrok</ConflictTitle>
                  <ConflictDesc mode={theme}>
                    Jadwal ini bentrok dengan &quot;{conflictingCourse}&quot;.
                    Pilih waktu lain.
                  </ConflictDesc>
                </ConflictTextCol>
              </ConflictAlertBox>
            )}

            {/* Deskripsi */}
            <FormGroup>
              <Label mode={theme}>Deskripsi</Label>
              <TextArea
                rows={3}
                placeholder="Tambahkan deskripsi atau catatan (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                mode={theme}
              />
            </FormGroup>

            {/* Lokasi */}
            <FormGroup>
              <Label mode={theme}>Lokasi</Label>
              <TextInput
                type="text"
                placeholder="Tambahkan lokasi pelaksanaan (opsional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                mode={theme}
              />
            </FormGroup>
          </ScrollBody>

          <ModalActions>
            <CancelButton type="button" onClick={handleClose} mode={theme}>
              Batal
            </CancelButton>
            <SaveButton
              type="button"
              disabled={!isFormValid}
              onClick={handleSave}
              mode={theme}
            >
              Simpan
            </SaveButton>
          </ModalActions>
        </ModalBody>
      </StyledModalContent>
    </Modal>
  );
}

export default CustomizeJadwalModal;

/* Styles */
const StyledModalContent = styled(ModalContent)`
  border-radius: 16px !important;
  background-color: ${({ mode }) =>
    mode === "light" ? "#FFFFFF" : "#2C2C2C"} !important;
  border: 1px solid ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#333333")} !important;
  padding: 32px 24px !important;
  max-width: 634px !important;
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#FFFFFF")};

  @media (max-width: 768px) {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    border-radius: 16px 16px 0px 0px !important;
    padding: 16px 20px 24px !important;
  }
`;

const MobileHandle = styled.div`
  display: none;
  width: 135px;
  height: 12px;
  background-color: ${({ mode }) => (mode === "light" ? "#E5E5E5" : "#404040")};
  border-radius: 90px;
  margin: 0 auto 16px auto;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ModalTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3em;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#917DEC")};
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ScrollBody = styled.div`
  max-height: 520px;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9cefc;
    border-radius: 6px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Label = styled.label`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#917DEC")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Required = styled.span`
  color: #fb2c36;
`;

const TextInput = styled.input`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  height: 48px;
  padding: 12px 16px;
  border-radius: 8px;
  outline: none;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#404040")};
  border: 2px solid ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#674DE0")};
  color: ${({ mode }) => (mode === "light" ? "#333333" : "#FFFFFF")};

  &::placeholder {
    color: ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#D4D4D4")};
  }

  &:focus {
    border-color: #5038bc;
  }
`;

const TextArea = styled.textarea`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#404040")};
  border: 2px solid ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#674DE0")};
  color: ${({ mode }) => (mode === "light" ? "#333333" : "#FFFFFF")};

  &::placeholder {
    color: ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#D4D4D4")};
  }

  &:focus {
    border-color: #5038bc;
  }
`;

const ChipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 16px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 10px;
  }
`;

const DayChip = styled.button`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  height: 40px;
  border-radius: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  background-color: ${({ selected, mode }) =>
    selected ? "#5038BC" : mode === "light" ? "#FFFFFF" : "#2C2C2C"};
  color: ${({ selected, mode }) =>
    selected ? "#FFFFFF" : mode === "light" ? "#45349F" : "#7368EC"};
  border: 2px solid
    ${({ selected, mode }) =>
      selected ? "#5038BC" : mode === "light" ? "#45349F" : "#7368EC"};

  &:hover {
    opacity: 0.9;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeChip = styled.button`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  min-width: 120px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#404040")};
  border: 2px solid ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#674DE0")};
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#A8ADF9")};

  &:hover {
    border-color: #5038bc;
  }
`;

const TimeSeparatorText = styled.span`
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#917DEC")};
`;

const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#404040")};
  border: 2px solid ${({ mode }) => (mode === "light" ? "#A1A1A1" : "#674DE0")};
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ArrowBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ mode }) => (mode === "light" ? "#7368EC" : "#A8ADF9")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  &:hover {
    color: #5038bc;
  }
`;

const TimeVal = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#F4F4F4")};
`;

const TimeSeparator = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${({ mode }) => (mode === "light" ? "#7368EC" : "#917DEC")};
`;

const ConflictAlertBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ mode }) => (mode === "light" ? "#FEF2F2" : "#460809")};
  border: 1px solid ${({ mode }) => (mode === "light" ? "#FCA5A5" : "#FB2C36")};
`;

const ConflictTextCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ConflictTitle = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ mode }) => (mode === "light" ? "#DC2626" : "#F5F5F5")};
`;

const ConflictDesc = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  color: ${({ mode }) => (mode === "light" ? "#DC2626" : "#E5E5E5")};
`;

const ErrorText = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  color: #dc2626;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background-color: #c9cefc;
  color: #45349f;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b8befa;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background-color: #5038bc;
  color: #ffffff;
  border: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #432e9f;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
