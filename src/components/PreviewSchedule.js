import React from "react";
import { useSelector } from "react-redux";
import { Text, useColorModeValue } from "@chakra-ui/react";
import styled from "styled-components";
import Schedule from "containers/ViewSchedule/Schedule";

const DESKTOP_PREVIEW_SCALE = 0.5;
const MOBILE_PREVIEW_SCALE = 0.8;
const VIEWPORT_HEIGHT = 990 * 0.7 * DESKTOP_PREVIEW_SCALE;
const MOBILE_VIEWPORT_HEIGHT = 990 * 0.7 * MOBILE_PREVIEW_SCALE;

const PreviewSchedule = () => {
  const schedules = useSelector((state) => state.schedules);
  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");

  if (schedules.length === 0) {
    return null;
  }

  const combinedItems = schedules.flatMap((schedule) =>
    schedule.schedule_items.map((item) => ({
      ...item,
      name: schedule.name,
      course_name: schedule.parentName,
      sks: schedule.credit,
      lecturer: schedule.lecturer,
    })),
  );

  const virtualSchedule = {
    name: "Preview Jadwal",
    schedule_items: combinedItems,
  };

  return (
    <PreviewContainer mode={theme} isMobile={isMobile}>
      <Text
        fontWeight="bold"
        fontSize={{ base: "20px", md: "24px" }}
        color={theme === "light" ? "primary.Purple" : "dark.Purple"}
        textAlign="center"
        mb="16px"
      >
        Preview Jadwal
      </Text>

      <ScheduleWrapper
        mode={theme}
        style={{
          height: isMobile
            ? `${MOBILE_VIEWPORT_HEIGHT}px`
            : `${VIEWPORT_HEIGHT}px`,
        }}
      >
        {isMobile ? (
          <ScheduleViewport>
            <MobileScheduleScale>
              <Schedule
                width="100%"
                pxPerMinute={0.7}
                schedule={virtualSchedule}
                startHour={7}
                endHour={21}
                showHeader
                showLabel
                showRoom
                forceDesktopLayout
              />
            </MobileScheduleScale>
          </ScheduleViewport>
        ) : (
          <ScheduleViewport>
            <ScheduleScale>
              <Schedule
                width="100%"
                pxPerMinute={0.7}
                schedule={virtualSchedule}
                startHour={7}
                endHour={21}
                showHeader
                showLabel
                showRoom
              />
            </ScheduleScale>
          </ScheduleViewport>
        )}
      </ScheduleWrapper>
    </PreviewContainer>
  );
};

export default PreviewSchedule;

const PreviewContainer = styled.div`
  width: 100%;
  padding-bottom: 16px;
  padding-left: ${({ isMobile }) => (isMobile ? "16px" : "0")};
  padding-right: ${({ isMobile }) => (isMobile ? "16px" : "0")};
  margin-bottom: ${({ isMobile }) => (isMobile ? "16px" : "0")};
`;

const ScheduleWrapper = styled.div`
  width: 100%;
  height: ${VIEWPORT_HEIGHT}px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${({ mode }) => (mode === "light" ? "#5038BC" : "#674DE0")};
  box-shadow: ${({ mode }) =>
    mode === "light"
      ? "0px 1px 2px 0px rgba(0, 0, 0, 0.06)"
      : "0px 1px 3px 0px rgba(0, 0, 0, 0.1)"};
`;

const ScheduleViewport = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ScheduleScale = styled.div`
  width: calc(100% / ${DESKTOP_PREVIEW_SCALE});
  transform: scale(${DESKTOP_PREVIEW_SCALE});
  transform-origin: top left;

  .wrapper {
    padding: 3px 5px !important;
  }

  .header {
    display: none !important;
  }

  .details-desktop {
    font-size: 12px !important;
    line-height: 1.2 !important;
    overflow: hidden !important;
    word-break: break-word !important;
  }
`;

const MobileScheduleScale = styled.div`
  width: calc(100% / ${MOBILE_PREVIEW_SCALE});
  transform: scale(${MOBILE_PREVIEW_SCALE});
  transform-origin: top left;

  .wrapper {
    padding: 3px 4px !important;
  }

  /* Khusus di Mobile Preview: Sembunyikan header jam/ruangan agar hanya menampilkan nama mata kuliah */
  .header {
    display: none !important;
  }

  .details-desktop {
    font-size: 12px !important;
    line-height: 1 !important;
    font-weight: 600 !important;
    overflow: hidden !important;
    word-break: break-word !important;
  }

  .room {
    display: none !important;
  }
`;
