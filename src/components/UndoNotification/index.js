import React from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import { useUndoAction, UNDO_DISMISS_MS } from "hooks/useUndoAction";

function UndoNotification({ lastAction, onUndo }) {
  const theme = useColorModeValue("light", "dark");

  if (!lastAction) {
    return null;
  }

  const { type, course } = lastAction;
  const courseName = course?.parentName || course?.name || "Mata Kuliah";
  const courseCredit = course?.credit != null ? `${course.credit} SKS` : "";
  const actionText =
    type === "add" ? "berhasil ditambahkan" : "berhasil dihapus";

  return (
    <Container key={lastAction.id} mode={theme} data-testid="undo-notification">
      <TopBar mode={theme} />
      <ContentWrapper>
        <MessageText mode={theme}>
          <span>Mata Kuliah </span>
          <CourseHighlight mode={theme}>
            {courseName}
            {courseCredit ? ` (${courseCredit})` : ""}
          </CourseHighlight>
          <span> {actionText}</span>
        </MessageText>
        <UndoButton
          mode={theme}
          onClick={onUndo}
          type="button"
          data-testid="undo-button"
        >
          Urungkan
        </UndoButton>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  box-shadow: ${({ mode }) =>
    mode === "light"
      ? "0px 0.5px 2px 0px rgba(0, 0, 0, 0.25)"
      : "0px 0.5px 2px 0px rgba(0, 0, 0, 0.25)"};
`;

const topBarCountdownLight = keyframes`
  from {
    transform: scaleX(1);
    background-color: #644be0;
  }
  to {
    transform: scaleX(0);
    background-color: #b7acf2;
  }
`;

const topBarCountdownDark = keyframes`
  from {
    transform: scaleX(1);
    background-color: #7368ec;
  }
  to {
    transform: scaleX(0);
    background-color: #4a4390;
  }
`;

const TopBar = styled.div`
  height: 4px;
  width: 100%;
  border-radius: 30px 30px 30px 30px;
  background-color: ${({ mode }) => (mode === "light" ? "#644BE0" : "#7368EC")};
  transform-origin: left center;
  animation: ${({ mode }) =>
      mode === "light" ? topBarCountdownLight : topBarCountdownDark}
    ${UNDO_DISMISS_MS}ms linear forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px 16px 16px;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 10px 12px 14px 12px;
  }
`;

const MessageText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  text-align: left;
  word-break: break-word;
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#F4F4F4")};
  flex: 1;
`;

const CourseHighlight = styled.span`
  color: ${({ mode }) => (mode === "light" ? "#45349F" : "#7368EC")};
  font-weight: 500;
`;

const UndoButton = styled.button`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  padding: 8px 16px;
  height: 38px;
  border-radius: 8px;
  border: 2px solid ${({ mode }) => (mode === "light" ? "#5038BC" : "#7368EC")};
  color: ${({ mode }) => (mode === "light" ? "#45349F" : "#7368EC")};
  background-color: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ mode }) =>
      mode === "light"
        ? "rgba(80, 56, 188, 0.08)"
        : "rgba(115, 104, 236, 0.15)"};
  }

  &:active {
    background-color: ${({ mode }) =>
      mode === "light"
        ? "rgba(80, 56, 188, 0.16)"
        : "rgba(115, 104, 236, 0.25)"};
  }
`;

export function FloatingUndoNotification() {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const { lastAction, undo } = useUndoAction();

  if (!isMobile || !lastAction) {
    return null;
  }

  return (
    <FloatingWrapper>
      <UndoNotification lastAction={lastAction} onUndo={undo} />
    </FloatingWrapper>
  );
}

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 84px;
  left: 1rem;
  right: 1rem;
  z-index: 10;
`;

export default UndoNotification;
