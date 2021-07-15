import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { isScheduleConflict } from "containers/SelectedCourses/utils";

function Checkout({ onClickDetail }) {
  const schedules = useSelector(state => state.schedules);
  const isMobile = useSelector(state => state.appState.isMobile);

  const totalCredits = schedules.reduce((prev, { credit }) => prev + credit, 0);

  if (!isMobile || schedules.length === 0) {
    return null;
  };

  const conflict = schedules.find(schedule =>
    isScheduleConflict(schedules, schedule)
  );

  function goToDetail() {
    onClickDetail(conflict);
  };

  return (
    <CheckoutContainer conflict={conflict} onClick={goToDetail}>
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
  color: ${props => props.theme.color.primaryWhite};

  background: ${props => (
    props.conflict
      ? props => props.theme.color.stateError
      : props => props.theme.color.primaryPurple
  )};

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

export default Checkout;
