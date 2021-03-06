import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useColorModeValue } from "@chakra-ui/react";
import SelectedCourses from "containers/SelectedCourses";
import backImg from "assets/Beta/xmark.svg";

const HideBodyOverflow = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

function Detail({ closeDetail, isEditing = false, scheduleId }) {
  const theme = useColorModeValue("light", "dark");
  function performCloseDetail() {
    closeDetail();
  }

  return (
    <Container mode={theme}>
      <HideBodyOverflow />
      <ImageButton src={backImg} onClick={performCloseDetail} />
      <SelectedCourses isEditing={isEditing} scheduleId={scheduleId} />
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(props) =>
    props.mode === "light"
      ? props.theme.color.primaryWhite
      : props.theme.color.darkBlack};
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 322;
  padding: 1rem;
  overflow: auto;
  position: fixed;
`;

const ImageButton = styled.button`
  background: url(${({ src }) => src}) no-repeat;
  cursor: pointer;
  height: 24px;
  width: 24px;
  border: none;
  display: block;
  margin-left: auto;
`;

export default Detail;
