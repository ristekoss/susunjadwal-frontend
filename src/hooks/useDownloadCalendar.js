import { ErrorToast, SuccessToast } from "components/Toast";
import { useState } from "react";
import { useSelector } from "react-redux";
import { dayToColumn, getDayOfCurrentWeek } from "utils/date";
import useDidUpdate from "./useDidUpdate";
const ics = require("ics");

const useDownloadCalendar = () => {
  const [events, setEvents] = useState();
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const isMobile = useSelector((state) => state.appState.isMobile);
  const fn = () =>
    ics.createEvents(events, (error, value) => {
      if (error) {
        console.error(error.message);
        ErrorToast("Terjadi kesalahan, silakan dicoba kembali.", isMobile);
        setError(error);
        return error;
      }
      setData(value);
      const dlurl = `data:text/calendar;charset=utf-8,${value}`;
      download(dlurl);
      SuccessToast("Berhasil download jadwal!", isMobile);
      return value;
    });

  const parseFormattedScheduleToEvent = (formattedSchedule) => {
    const classes = [];
    Object.keys(formattedSchedule).forEach((subject) => {
      formattedSchedule[subject].time.forEach((item) => {
        const calendarDate = getDayOfCurrentWeek(dayToColumn(item.day));
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth() + 1;
        const day = calendarDate.getDate();
        const [startHour, startMinute] = item.start.split(".").map((item) => {
          return parseInt(item, 10);
        });
        const [endHour, endMinute] = item.end.split(".").map((item) => {
          return parseInt(item, 10);
        });
        const data = {
          start: [year, month, day, startHour, startMinute],
          end: [year, month, day, endHour, endMinute],
          title: formattedSchedule[subject].name,
          location: item.room,
        };
        classes.push(data);
      });
    });
    return classes;
  };

  useDidUpdate(fn, [events]);

  return {
    generateICalendarFile: setEvents,
    parseFormattedScheduleToEvent,
    error,
    data,
  };
};

function download(fileURL) {
  const isIE = window.ActiveXObject;
  if (!isIE) {
    let save = document.createElement("a");
    save.href = fileURL;
    save.target = "_blank";
    save.download = "hehe.ics";

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
