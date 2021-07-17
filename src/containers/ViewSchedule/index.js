import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import { useSelector, useDispatch } from "react-redux";

import { getSchedule, postRenameSchedule, deleteSchedule } from "services/api";
import { makeAtLeastMs } from "utils/promise";
import { setLoading } from "redux/modules/appState";

import Schedule from "./Schedule";
import ControlledInput from "./ControlledInput";
import { decodeHtmlEntity } from "utils/string";
import { Button } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { CopyToClipboard } from "react-copy-to-clipboard";

import deleteImg from "assets/Delete.svg";
import clipboardImg from "assets/Clipboard.svg";

function ViewSchedule({ match, history }) {
  const dispatch = useDispatch();
  const isMobile = useSelector(state => state.appState.isMobile);
  const auth = useSelector(state => state.auth);
  const { scheduleId } = useParams();

  const [schedule, setSchedule] = useState(null);

  async function onRename(slug, value) {
    if (auth) {
      await postRenameSchedule(auth.userId, slug, value);
      setSchedule({ ...schedule, name: value });
    }
  }

  useEffect(() => {
    async function fetchSchedule() {
      dispatch(setLoading(true));
      const {
        data: { user_schedule }
      } = await makeAtLeastMs(getSchedule(match.params.scheduleId), 1000);
      setSchedule(user_schedule);
      dispatch(setLoading(false));
    }
    fetchSchedule();
  }, [match, dispatch]);

  const scheduleName = schedule && schedule.name;

  const showAlertCopy = () => {
    alert(
      "Link telah disalin!! Kamu bisa bagikan link tersebut ke teman kamu."
    );
  }

  const performDeleteSchedule = async (userId, scheduleId) => {
    dispatch(setLoading(true));
    await makeAtLeastMs(deleteSchedule(userId, scheduleId), 1000);
    history.push('/jadwal');
  }

  const confirmDeleteSchedule = (scheduleId) => {
    const response = window.confirm("Apakah kamu yakin akan menghapusnya?");
    if (response) {
      performDeleteSchedule(auth.userId, scheduleId);
    }
  }

  return (
    <MainContainer>
      <Helmet
        title={scheduleName ? `Jadwal ${scheduleName}` : `Jadwal Untitled`}
        meta={[{ name: "description", content: "Description of Jadwal" }]}
      />

      {schedule && (
        <Container>
          {schedule.has_edit_access ? (
            <ControlledInput
              name={decodeHtmlEntity(schedule.name)}
              slug={match.params.scheduleId}
              rename={onRename}
            />
          ) : (
              <ScheduleName>
                {decodeHtmlEntity(schedule.name)}
              </ScheduleName>
            )}
            <ButtonContainer>
              <ImageButton
                onClick={() => confirmDeleteSchedule(schedule.id)}
              >
                <img src={deleteImg} alt="delete"/>
              </ImageButton>
              <CopyToClipboard
                    text={`${window.location.href}/${schedule.id}`}
                    onCopy={showAlertCopy}
                  >
                    <ImageButton>
                      <img src={clipboardImg} alt="copy"/>
                    </ImageButton>
                  </CopyToClipboard>
              <Link to={`/edit/${scheduleId}`} >
                <Button intent="primary" variant="outline" onClick={() => null} >
                  {schedule.has_edit_access ? 'Edit' : 'Copy'}
                </Button>
              </Link>
            </ButtonContainer>
            
        </Container>
      )}

      <Schedule
        width="100%"
        pxPerMinute={isMobile ? 0.7 : 0.9}
        schedule={schedule}
        startHour={7}
        endHour={21}
        showHeader
        showLabel
        showRoom
      />
    </MainContainer>
  );
}

const MainContainer = styled.div`
  padding: 0px !important;
`;

const Container = styled.div`
  padding: 32px 48px;
  padding-bottom: 16px;
  background-color: transparent;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
`;

const ScheduleName = styled.div`
  font-size: 32px;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ImageButton = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 1rem;
`;

export default ViewSchedule;
