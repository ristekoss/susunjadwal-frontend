import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";

import { ErrorToast } from "components/Toast";
import { parseFormattedScheduleToEvent } from "utils/schedule";

const ics = require("ics");

const useDownloadCalendar = () => {
  const [schedule, setSchedule] = useState();
  const [error, setError] = useState("");
  const [data, setData] = useState("");

  const isMobile = useSelector((state) => state.appState.isMobile);
  const theme = useColorModeValue("light", "dark");

  const fn = useCallback(() => {
    ics.createEvents(
      parseFormattedScheduleToEvent(schedule),
      (error, value) => {
        if (error) {
          console.error(error.message);
          ErrorToast(
            "Terjadi kesalahan saat mengunduh jadwal.",
            isMobile,
            theme,
          );
          setError(error);
          return error;
        }

        setData(value);
        const dlurl = `data:text/calendar;charset=utf-8,${value}`;
        download(dlurl, `${schedule.name || "Untitled"} - SusunJadwal.ics`);
        return value;
      },
    );
  }, [schedule, isMobile, theme]);

  useEffect(() => {
    if (schedule != null) {
      fn();
      setSchedule(null);
    }
  }, [schedule, fn]);

  return {
    generateICalendarFile: setSchedule,
    parseFormattedScheduleToEvent,
    error,
    data,
  };
};

function download(fileURL, fileName) {
  const isIE = window.ActiveXObject;
  if (!isIE) {
    let save = document.createElement("a");
    save.href = fileURL;
    save.target = "_blank";
    save.download = fileName;

    let evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    save.dispatchEvent(evt);

    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  }
}

export default useDownloadCalendar;
