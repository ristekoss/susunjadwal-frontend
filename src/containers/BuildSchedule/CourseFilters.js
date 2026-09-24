import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Box, Switch } from "@chakra-ui/react";
import { FiFilter, FiX, FiChevronUp, FiChevronDown } from "react-icons/fi";
import {
  COURSE_CATEGORIES,
  COURSE_DAYS,
  DEFAULT_COURSE_FILTERS,
} from "utils/courseFilters";

const SKS_OPERATOR_TABS = [
  { value: "gt", label: "Lebih Dari" },
  { value: "eq", label: "Sama Dengan" },
  { value: "lt", label: "Kurang Dari" },
];

const PURPLE = "#5038BC";
const PURPLE_DARK = "#7368EC";
const PURPLE_DEEP = "#45349F";
const LAVENDER = "#E1E5FE";
const NEUTRAL_500 = "#737373";
const NEUTRAL_300 = "#D4D4D4";

function CustomTimePickerDropdown({ value, onChange, onClose, theme }) {
  const parseTime = (val) => {
    if (!val) return { hours: 7, minutes: 0 };
    const [hStr, mStr] = String(val).replace(".", ":").split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    return {
      hours: Number.isNaN(h) ? 7 : Math.min(23, Math.max(0, h)),
      minutes: Number.isNaN(m) ? 0 : Math.min(59, Math.max(0, m)),
    };
  };

  const { hours, minutes } = parseTime(value);

  const format2Digit = (n) => String(n).padStart(2, "0");

  const setTime = (newH, newM) => {
    const validH = (newH + 24) % 24;
    const validM = (newM + 60) % 60;
    onChange(`${format2Digit(validH)}:${format2Digit(validM)}`);
  };

  const stepHour = (delta) => {
    setTime(hours + delta, minutes);
  };

  const stepMinute = (delta) => {
    setTime(hours, minutes + delta);
  };

  return (
    <TimePickerPopup mode={theme} onClick={(e) => e.stopPropagation()}>
      <TimePickerColumn>
        <TimeStepperButton
          mode={theme}
          type="button"
          aria-label="Tambah jam"
          onClick={() => stepHour(1)}
        >
          <FiChevronUp />
        </TimeStepperButton>
        <TimeNumberText mode={theme}>{hours}</TimeNumberText>
        <TimeStepperButton
          mode={theme}
          type="button"
          aria-label="Kurang jam"
          onClick={() => stepHour(-1)}
        >
          <FiChevronDown />
        </TimeStepperButton>
      </TimePickerColumn>

      <TimeColonText mode={theme}>:</TimeColonText>

      <TimePickerColumn>
        <TimeStepperButton
          mode={theme}
          type="button"
          aria-label="Tambah menit"
          onClick={() => stepMinute(5)}
        >
          <FiChevronUp />
        </TimeStepperButton>
        <TimeNumberText mode={theme}>{format2Digit(minutes)}</TimeNumberText>
        <TimeStepperButton
          mode={theme}
          type="button"
          aria-label="Kurang menit"
          onClick={() => stepMinute(-5)}
        >
          <FiChevronDown />
        </TimeStepperButton>
      </TimePickerColumn>
    </TimePickerPopup>
  );
}

function CourseFilterPanel({
  appliedFilters,
  onApply,
  onClose,
  onDraftChange,
  resultCount,
  theme,
  isMobile,
}) {
  const [draft, setDraft] = useState(appliedFilters);
  const [activeTimePicker, setActiveTimePicker] = useState(null); // 'start' | 'end' | null
  const timeRowRef = useRef(null);

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const toggleItem = (list, item) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const currentSks = parseInt(draft.sks, 10) || 0;

  useEffect(() => {
    onDraftChange?.(draft);
  }, [draft, onDraftChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (timeRowRef.current && !timeRowRef.current.contains(e.target)) {
        setActiveTimePicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <PanelContainer mode={theme} isMobile={isMobile}>
      <PanelHeader>
        <PanelTitle mode={theme} isMobile={isMobile}>
          Filter
        </PanelTitle>
        <CloseButton
          mode={theme}
          type="button"
          aria-label="Tutup filter"
          onClick={onClose}
        >
          <FiX />
        </CloseButton>
      </PanelHeader>

      <SectionLabel mode={theme} isMobile={isMobile}>
        Kategori Kelas
      </SectionLabel>
      <ChipsRow>
        {COURSE_CATEGORIES.map((category) => (
          <Chip
            key={category}
            mode={theme}
            isMobile={isMobile}
            type="button"
            selected={draft.categories.includes(category)}
            onClick={() =>
              update({ categories: toggleItem(draft.categories, category) })
            }
          >
            {category}
          </Chip>
        ))}
      </ChipsRow>

      <SectionLabel mode={theme} isMobile={isMobile}>
        Hari
      </SectionLabel>
      <ChipsRow>
        {COURSE_DAYS.map((day) => (
          <Chip
            key={day}
            mode={theme}
            isMobile={isMobile}
            type="button"
            selected={draft.days.includes(day)}
            onClick={() => update({ days: toggleItem(draft.days, day) })}
          >
            {day}
          </Chip>
        ))}
      </ChipsRow>
      {/* {draft.days.length > 0 && (
        <SwitchRow mode={theme}>
          <Switch
            size="sm"
            colorScheme="purple"
            isChecked={draft.strictDays}
            onChange={(e) => update({ strictDays: e.target.checked })}
          />
          <span>Semua sesi kelas harus berada di hari yang dipilih</span>
        </SwitchRow>
      )} */}

      <SectionLabel mode={theme} isMobile={isMobile}>
        Jam Kuliah
      </SectionLabel>
      <TimeRow ref={timeRowRef}>
        <TimeInputWrapper>
          <TimeChipButton
            mode={theme}
            type="button"
            hasValue={Boolean(draft.startTime)}
            isActive={activeTimePicker === "start"}
            onClick={() => {
              if (!draft.startTime) {
                update({ startTime: "07:00" });
              }
              setActiveTimePicker(
                activeTimePicker === "start" ? null : "start",
              );
            }}
          >
            {draft.startTime || "Waktu Mulai"}
          </TimeChipButton>
          {activeTimePicker === "start" && (
            <CustomTimePickerDropdown
              value={draft.startTime || "07:00"}
              onChange={(val) => update({ startTime: val })}
              onClose={() => setActiveTimePicker(null)}
              theme={theme}
            />
          )}
        </TimeInputWrapper>
        <TimeDash mode={theme}>-</TimeDash>
        <TimeInputWrapper>
          <TimeChipButton
            mode={theme}
            type="button"
            hasValue={Boolean(draft.endTime)}
            isActive={activeTimePicker === "end"}
            onClick={() => {
              if (!draft.endTime) {
                update({ endTime: "17:00" });
              }
              setActiveTimePicker(activeTimePicker === "end" ? null : "end");
            }}
          >
            {draft.endTime || "Waktu Selesai"}
          </TimeChipButton>
          {activeTimePicker === "end" && (
            <CustomTimePickerDropdown
              value={draft.endTime || "17:00"}
              onChange={(val) => update({ endTime: val })}
              onClose={() => setActiveTimePicker(null)}
              theme={theme}
            />
          )}
        </TimeInputWrapper>
      </TimeRow>
      {(draft.startTime || draft.endTime) && (
        <SwitchRow mode={theme}>
          <Switch
            size="sm"
            colorScheme="purple"
            isChecked={draft.strictTime}
            onChange={(e) => update({ strictTime: e.target.checked })}
          />
          <span>Semua sesi kelas harus berada dalam rentang jam</span>
        </SwitchRow>
      )}

      <SectionLabel mode={theme} isMobile={isMobile}>
        Jumlah SKS
      </SectionLabel>
      <TabsContainer>
        {SKS_OPERATOR_TABS.map((tab) => (
          <SksTab
            key={tab.value}
            mode={theme}
            type="button"
            active={draft.sksOp === tab.value}
            onClick={() => update({ sksOp: tab.value })}
          >
            {tab.label}
          </SksTab>
        ))}
      </TabsContainer>
      <StepperRow>
        <StepButton
          mode={theme}
          type="button"
          aria-label="Kurangi SKS"
          onClick={() => update({ sks: String(Math.max(0, currentSks - 1)) })}
        >
          -
        </StepButton>
        <SksValue>{currentSks}</SksValue>
        <StepButton
          mode={theme}
          type="button"
          aria-label="Tambah SKS"
          onClick={() => update({ sks: String(Math.min(24, currentSks + 1)) })}
        >
          +
        </StepButton>
      </StepperRow>

      {/* <SwitchRow mode={theme}>
        <Switch
          size="sm"
          colorScheme="purple"
          isChecked={draft.fuzzy}
          onChange={(e) => update({ fuzzy: e.target.checked })}
        />
        <span>(Dev test) Fuzzy Matching</span>
      </SwitchRow> */}

      <FooterRow>
        <ApplyButton mode={theme} type="button" onClick={() => onApply(draft)}>
          Terapkan Filter
          {resultCount != null ? ` (${resultCount} hasil)` : ""}
        </ApplyButton>
        <ResetButton
          mode={theme}
          type="button"
          onClick={() => setDraft({ ...DEFAULT_COURSE_FILTERS })}
        >
          Reset Filter
        </ResetButton>
      </FooterRow>
    </PanelContainer>
  );
}

export function FilterTriggerButton({
  count,
  onClick,
  theme,
  isMobile,
  disabled,
  title,
}) {
  return (
    <TriggerButtonContainer
      mode={theme}
      isMobile={isMobile}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <FiFilter />
      <TriggerLabel mode={theme} isMobile={isMobile}>
        Filter
      </TriggerLabel>
      {count > 0 && <TriggerBadge mode={theme}>{count}</TriggerBadge>}
    </TriggerButtonContainer>
  );
}

export function FilterPopupContainer({ children, isMobile }) {
  return (
    <PopupContainerWrapper isMobile={isMobile}>
      {children}
    </PopupContainerWrapper>
  );
}

const PopupContainerWrapper = styled.div`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? "54px" : "67px")};
  left: 0;
  z-index: 30;
  width: ${({ isMobile }) => (isMobile ? "100%" : "578px")};
  max-width: 100%;
`;

const PanelContainer = styled(Box)`
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  border: 1px solid ${({ mode }) => (mode === "light" ? "#E5E5E5" : "#3D3D3D")};
  border-radius: 16px;
  box-shadow: 0px 0.5px 2px 0px rgba(0, 0, 0, 0.25);
  padding: ${({ isMobile }) => (isMobile ? "24px 16px" : "32px 24px")};
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 19px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: ${({ isMobile }) => (isMobile ? "24px" : "32px")};
  line-height: 1.4;
  color: ${({ mode }) => (mode === "light" ? PURPLE : "#F4F4F4")};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: ${({ mode }) => (mode === "light" ? PURPLE : "#917DEC")};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const SectionLabel = styled.p`
  margin: 0 0 12px 0;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: ${({ isMobile }) => (isMobile ? "16px" : "20px")};
  line-height: 28px;
  color: ${({ mode }) => (mode === "light" ? PURPLE : "#F4F4F4")};
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const Chip = styled.button`
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: ${({ isMobile }) => (isMobile ? "14px" : "16px")};
  line-height: 24px;
  padding: 8px 16px;
  border-radius: 40px;
  cursor: pointer;
  ${({ mode, selected }) =>
    selected
      ? `background-color: ${mode === "light" ? PURPLE : PURPLE_DARK};
         border: 2px solid ${mode === "light" ? PURPLE : PURPLE_DARK};
         color: #FFFFFF;`
      : `background-color: transparent;
         border: 2px solid ${mode === "light" ? PURPLE_DEEP : PURPLE_DARK};
         color: ${mode === "light" ? PURPLE_DEEP : PURPLE_DARK};`}
`;

const TimeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const TimeInputWrapper = styled.div`
  position: relative;
  width: 148px;
`;

const TimeChipButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 40px;
  border: 2px solid
    ${({ mode, isActive }) =>
      isActive
        ? mode === "light"
          ? PURPLE
          : PURPLE_DARK
        : mode === "light"
        ? PURPLE_DEEP
        : PURPLE_DARK};
  background-color: transparent;
  color: ${({ mode, hasValue }) =>
    hasValue
      ? mode === "light"
        ? PURPLE
        : "#F4F4F4"
      : mode === "light"
      ? NEUTRAL_300
      : NEUTRAL_500};
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  }
`;

const TimePickerPopup = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 40;
  width: 148px;
  height: 150px;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  border: 1px solid ${({ mode }) => (mode === "light" ? "#E5E5E5" : "#3D3D3D")};
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 8px;
`;

const TimePickerColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 110px;
  width: 44px;
`;

const TimeStepperButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: ${({ mode }) => (mode === "light" ? NEUTRAL_500 : NEUTRAL_300)};
  border-radius: 4px;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  }
`;

const TimeNumberText = styled.span`
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: ${({ mode }) => (mode === "light" ? PURPLE_DARK : "#FFFFFF")};
  user-select: none;
`;

const TimeColonText = styled.span`
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: ${({ mode }) => (mode === "light" ? PURPLE_DARK : "#FFFFFF")};
  user-select: none;
  margin-bottom: 2px;
`;

const TimeDash = styled.span`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: ${({ mode }) => (mode === "light" ? PURPLE : "#F4F4F4")};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const SksTab = styled.button`
  flex: 1 0 0;
  height: 48px;
  border: none;
  cursor: pointer;
  border-radius: ${({ active }) => (active ? "10px" : "8px")};
  background-color: ${({ active }) => (active ? LAVENDER : "transparent")};
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ mode, active }) =>
    active ? PURPLE : mode === "light" ? NEUTRAL_500 : NEUTRAL_300};

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
`;

const StepButton = styled.button`
  width: 54px;
  height: 44px;
  border-radius: 20px;
  background-color: transparent;
  border: 2px solid
    ${({ mode }) => (mode === "light" ? PURPLE_DEEP : PURPLE_DARK)};
  color: ${({ mode }) => (mode === "light" ? PURPLE_DEEP : PURPLE_DARK)};
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SksValue = styled.span`
  min-width: 48px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  color: ${PURPLE_DARK};
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -8px 0 24px 0;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: ${({ mode }) => (mode === "light" ? NEUTRAL_500 : NEUTRAL_300)};
`;

const FooterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const ApplyButton = styled.button`
  height: 54px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  &:hover {
    opacity: 0.9;
  }
`;

const ResetButton = styled.button`
  height: 54px;
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  color: ${({ mode }) => (mode === "light" ? PURPLE_DEEP : PURPLE_DARK)};
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  &:hover {
    opacity: 0.9;
  }
`;

const TriggerButtonContainer = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: ${({ isMobile }) => (isMobile ? "44px" : "57px")};
  margin-right: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  border: 2px solid ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  color: ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TriggerLabel = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: ${({ isMobile }) => (isMobile ? "14px" : "18px")};
  line-height: 1.4;
  white-space: nowrap;
`;

const TriggerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${({ mode }) => (mode === "light" ? PURPLE : PURPLE_DARK)};
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

export default CourseFilterPanel;
