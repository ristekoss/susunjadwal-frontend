import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import useDidUpdate from "./useDidUpdate";
const ics = require('ics')

const useDownloadCalendar = () => {
  const [events, setEvents] = useState();
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const toast = useToast();
  const fn = () =>
    ics.createEvents(events, (error, value) => {
      if (error) {
        console.error(error.message);
        toast({
          id: 'error-generate-calendar',
          title: "Error",
          description: "Terjadi kesalahan, silakan dicoba kembali.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setError(error);
        return error;
      }
      setData(value);
      const dlurl = `data:text/calendar;charset=utf-8,${value}`;
      download(dlurl);
      toast({
        id: 'success-generate-calendar',
        title: "Berhasil download jadwal.",
        status: "success",
        duration: 30000,
        isClosable: true,
      });
      return value;
    });

  useDidUpdate(fn, [events]);

  return {
    generateICalendarFile: setEvents,
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
