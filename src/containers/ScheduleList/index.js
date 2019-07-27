import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { getSchedules, deleteSchedule } from "services/api";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import Schedule from "containers/ViewSchedule/Schedule";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";

function ScheduleList() {
  const auth = useSelector(state => state.auth);
  const isMobile = useSelector(state => state.appState.isMobile);

  const dispatch = useDispatch();

  const [schedules, setSchedules] = useState();

  useEffect(() => {
    const fetchSchedules = async () => {
      dispatch(setLoading(true));
      const {
        data: { user_schedules }
      } = await makeAtLeastMs(getSchedules(auth.userId), 1000);
      setSchedules(user_schedules);
      dispatch(setLoading(false));
    };

    fetchSchedules();
  }, [dispatch, auth]);

  async function performDeleteSchedule(userId, scheduleId) {
    dispatch(setLoading(true));
    await makeAtLeastMs(deleteSchedule(userId, scheduleId), 1000);
    const {
      data: { user_schedules }
    } = await makeAtLeastMs(getSchedules(auth.userId), 1000);
    setSchedules(user_schedules);
    dispatch(setLoading(false));
  }

  function confirmDeleteSchedule(scheduleId) {
    const response = window.confirm("Apakah kamu yakin akan menghapusnya?");
    if (response) {
      performDeleteSchedule(auth.userId, scheduleId);
    }
  }

  function showAlertCopy() {
    alert(
      "Link telah disalin!! Kamu bisa bagikan link tersebut ke teman kamu."
    );
  }

  return (
    <div>
      <Helmet
        title="Jadwal"
        meta={[{ name: "description", content: "Description of Jadwal" }]}
      />
      <PageTitle mobile={isMobile}>Daftar Jadwal</PageTitle>
      {schedules && schedules.length > 0 ? (
        <CardContainer>
          {schedules.map((schedule, idx) => (
            <Card key={`${schedule.name}-${idx}`}>
              <div className="header">
                <Link to={`/jadwal/${schedule.id}`}>
                  <h2>{schedule.name || "Untitled"}</h2>
                </Link>
                <div>
                  <CopyToClipboard
                    text={`${window.location.href}/${schedule.id}`}
                    onCopy={showAlertCopy}
                  >
                    <ImageButton src={clipboardImg} />
                  </CopyToClipboard>
                  <ImageButton
                    src={deleteImg}
                    onClick={() => confirmDeleteSchedule(schedule.id)}
                  />
                </div>
              </div>
              <Schedule
                startHour={7}
                endHour={21}
                schedule={schedule}
                pxPerMinute={isMobile ? 0.3 : 0.7}
                width="100%"
                showRoom
                mobile={isMobile}
              />
            </Card>
          ))}
        </CardContainer>
      ) : (
        <PageInfo mobile={isMobile}>
          You haven't created any schedules.
        </PageInfo>
      )}
    </div>
  );
}

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: ${({ mobile }) => (mobile ? "1rem" : "32px 48px 16px 48px")};
`;

const PageInfo = styled.h2`
  font-size: 1.1rem;
  margin: ${({ mobile }) => (mobile ? "1rem" : "32px 48px 16px 48px")};
`;

const Card = styled.div`
  border: 0.05rem solid rgba(48, 128, 119, 0.5);
  border-radius: 4;

  .header {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  ${props =>
    props.theme.mobile
      ? "margin: 1rem;"
      : css`
          width: 49%;
          &:nth-child(even) {
            margin-left: 2%;
          }
        `}
  margin-bottom: 32px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: ${props => (props.theme.mobile ? "column" : "row")};
  padding: ${props => (props.theme.mobile ? "1rem" : "0 48px")};
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
export default ScheduleList;
