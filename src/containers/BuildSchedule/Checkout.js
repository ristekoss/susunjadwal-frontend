import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { isScheduleConflict } from "containers/SelectedCourses/utils";

function Checkout({ onClickDetail }) {
  //TODO: Account for agenda tambahan
  const isMobile = useSelector(state => state.appState.isMobile);
  const schedules = useSelector(state => state.schedules);
  if (!isMobile || schedules.length === 0) {
    return null;
  }

  const totalCredits = schedules.reduce((prev, { credit }) => prev + credit, 0);
  const conflict = schedules.find(schedule =>
    isScheduleConflict(schedules, schedule)
  );

  function goToDetail() {
    if (!conflict) {
      onClickDetail();
    }
  }
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
      {!conflict && (
        <div>
          <h2>Lihat</h2>
        </div>
      )}
    </CheckoutContainer>
  );
}

const CheckoutContainer = styled.div`
  background: ${props => (props.conflict ? "#C74550" : "#308077")};
  color: #ffffff;
  position: fixed;
  justify-content: space-between;
  float: bottom;
  display: flex;
  flex-direction: row;
  height: auto;
  left: 1rem;
  width: calc(100% - 2rem);
  bottom: 1rem;
  align-items: center;
  border-radius: 8px;

  div {
    padding: 8px 16px;
  }

  h2 {
    margin-bottom: 0px;
    font-weight: 700;
    font-size: 16px;
  }

  p {
    margin-bottom: 0px;
    font-size: 16px;
  }
`;

export default Checkout;
