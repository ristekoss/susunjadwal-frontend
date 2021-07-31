import React, { useEffect, useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { useHistory } from 'react-router';

import { CopyToClipboard } from "react-copy-to-clipboard";

import { getSchedules, deleteSchedule } from "services/api";
import { setLoading } from "redux/modules/appState";
import { makeAtLeastMs } from "utils/promise";
import Schedule from "containers/ViewSchedule/Schedule";
import clipboardImg from "assets/Clipboard.svg";
import deleteImg from "assets/Delete.svg";
import { decodeHtmlEntity } from 'utils/string'
import EditIcon from "assets/EditSchedule/EditIcon";
import { BauhausSide } from 'components/Bauhaus';
import BauhausMobile from "assets/Beta/bauhaus-sm.svg";
import BauhausDesktop from "assets/Beta/bauhaus-lg.svg";

function ScheduleList() {
  const auth = useSelector(state => state.auth);
  const isMobile = useSelector(state => state.appState.isMobile);

  const dispatch = useDispatch();

  const [schedules, setSchedules] = useState();

  const history = useHistory();

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

  const handleClickEditJadwal = (idJadwal) => {
    history.push(`/edit/${idJadwal}`);
  }

  const convertDate = (date) => {
    const dateNew = new Date(date)
    return `${dateNew.getDate()}/${(dateNew.getMonth())+1}/${dateNew.getFullYear()}`
  }

  return (
    <Container>
      <Helmet
        title="Daftar Jadwal"
        meta={[{ name: "description", content: "Description of Jadwal" }]}
      />
      {schedules && schedules.length > 0? (
          <>
            <BauhausSide />
            <PageTitle mobile={isMobile}>Daftar Jadwal</PageTitle>
          </>
        ): ""}
      {schedules && schedules.length > 0 ? (
        <CardContainer>
          {schedules.map((schedule, idx) => (
            <Card key={`${schedule.name}-${idx}`}>
              <div className="headerInfo">
                <Link to={`/jadwal/${schedule.id}`}>
                  <h2>{decodeHtmlEntity(schedule.name) || "Untitled"}</h2>
                  <h4>Dibuat pada {convertDate(schedule.created_at)}</h4>
                </Link>
                <CardActionContainer>
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
                  <EditIcon className="editIcon" onClick={() => handleClickEditJadwal(schedule.id)} />
                </CardActionContainer>
              </div>
              <Schedule
                startHour={7}
                endHour={21}
                schedule={schedule}
                pxPerMinute={isMobile ? 0.3 : 0.7}
                width="100%"
                showRoom
              />
            </Card>
          ))}
        </CardContainer>
      ) : (
        <>
           {isMobile ? (
              <AssetBauhaus
                isMobile={isMobile}
                src={BauhausMobile}
                alt="bauhaus-sm"
              />
          ) : (
            <AssetBauhaus src={BauhausDesktop} alt="bauhaus-lg" />
          )}
          <Box pt="90px" mb={{base:16,md:'160px'}}>
            <div style={{  textAlign: isMobile?  "center": "left", width: "100%" }}>
            <PageTitleNoSchedule mobile={isMobile}>Daftar Jadwal</PageTitleNoSchedule>
              <PageInfo mobile={isMobile}>Anda belum pernah membuat jadwal. Mulai susun jadwal anda sekarang!</PageInfo>
              <Link to={`/susun`}>
                <Button height={{ base: "44px", md: "57px" }} width={{ base: "137px", md: "194px" }} ml={{md: 12}} fontSize={{ base: "14px", md: "18px" }}>Buat Jadwal</Button>
              </Link>
            </div>
          </Box>
        </>
        )}
    </Container>
  );
}
const Container = styled.div`
  margin-left:-3rem;
  margin-right: -3rem;
`;

const CardActionContainer = styled.div`
display:flex;
flex-direction:'row';
justify-content: center;
align-items:center;

.editIcon{
  margin-left:8px;
  cursor:pointer;
}
`;

const PageTitle = styled.h1`
  font-size: ${({ mobile }) => (mobile ? "1.7rem" : "2rem")};
  font-weight: bold;
  color: #5038BC;
  margin: ${({ mobile }) => (mobile ? "-40px 0 0 48px" : "0px 48px 30px 48px")};
`;

const PageTitleNoSchedule = styled.h1`
  font-size: ${({ mobile }) => (mobile ? "50px" : "64px")};
  font-weight: bold;
  color: #5038BC;
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 16px 48px")};
`;

const PageInfo = styled.h2`
  font-size: ${({ mobile }) => (mobile ? "14px" : "18px")};
  margin: ${({ mobile }) => (mobile ? "2rem" : "32px 48px 48px 48px")};
  color: #333333;
`;

const Card = styled.div`
  border: 0.05px solid #E5E5E5;
  border-radius: 8px;
  h2 {
    color: #333333;
    font-weight: bold;
    font-size: 24px;
  }
  h4{
    color: #333333;
    font-size: 14px;
  }
  .headerInfo {
    padding: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #F5F5F5;
  }
  ${props =>
    !props.theme.mobile &&
    css`
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
  padding: ${props => (props.theme.mobile ? "1rem 3rem 0 3rem" : "0 48px")};
  background-color: #ffffff;
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

const AssetBauhaus = styled.img`
  position: absolute;
  right: 0;
  top: 0;


  ${props => props.isMobile && (`
    top: 50px;
    width: 100%;
    display: block;

    @media (min-width: 540px) {
      display: none;
    }
  `)}
`;

export default ScheduleList;
