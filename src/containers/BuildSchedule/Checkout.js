import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import { isScheduleConflict } from "containers/SelectedCourses/utils";
import colorPaletteIcon from "assets/color-palette.svg";

function Checkout({ onClickDetail }) {
  const schedules = useSelector((state) => state.schedules);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");
  const totalCredits = schedules.reduce((prev, { credit }) => prev + credit, 0);

  if (!isMobile) {
    return null;
  }

  if (schedules.length === 0) {
    return (
      <FloatingMobileCustomize
        onClick={() => onClickDetail(false)}
        mode={theme}
      >
        <span>Customize Jadwal</span>
        <img src={colorPaletteIcon} alt="palette" width="20" height="20" />
      </FloatingMobileCustomize>
    );
  }

  const conflict = schedules.find((schedule) =>
    isScheduleConflict(schedules, schedule),
  );

  function goToDetail() {
    onClickDetail(conflict);
  }

  return (
    <CheckoutContainer
      conflict={conflict}
      onClick={goToDetail}
      mode={theme}
      style={{ zIndex: "4" }}
    >
      <div>
        <h2>
          {schedules.length} Mata Kuliah | {totalCredits} SKS
        </h2>
        <p>
          {conflict
            ? "Terdapat jadwal yang bentrok."
            : "Tidak ada konflik jadwal."}
        </p>
      </div>
      <div>
        <h2 className="cta">LIHAT</h2>
      </div>
    </CheckoutContainer>
  );
}

const CheckoutContainer = styled.div`
  color: ${(props) => props.theme.color.primaryWhite};

  background: ${(props) =>
    props.conflict
      ? (props) => props.theme.color.stateError
      : (props) =>
          props.mode === "light"
            ? props.theme.color.primaryPurple
            : props.theme.color.darkLightPurple};

  justify-content: space-between;
  position: fixed;
  float: bottom;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  align-items: center;
  flex-direction: row;

  width: calc(100% - 2rem);
  border-radius: 8px;
  height: auto;

  div {
    padding: 8px 16px;
  }

  h2 {
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 12px;

    &.cta {
      font-size: 14px;
    }
  }

  p {
    font-size: 12px;
    margin-bottom: 0px;
  }
`;

const FloatingMobileCustomize = styled.button`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: calc(100% - 2rem);
  height: 48px;
  border-radius: 8px;
  background-color: #c9cefc;
  color: #45349f;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background-color: #b8befa;
  }
`;

export default Checkout;
