import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import React from "react";
import { useToast } from "@chakra-ui/react";
const { createEvents } = require("ics");
import useDownloadCalendar from "../useDownloadCalendar";

jest.mock("ics", () => {
  return {
    createEvents: jest.fn(),
  };
});

jest.mock("@chakra-ui/react", () => {
  const ui = jest.requireActual("@chakra-ui/react");
  return {
    ...ui,
    useToast: jest.fn(() => jest.fn),
  };
});

describe("useDownloadCalendar", () => {
  let App;

  beforeEach(() => {
    App = function () {
      const { data, error, generateICalendarFile } = useDownloadCalendar();
      const mockEvent = [
        {
          start: [2021, 10, 30, 6, 30],
          duration: { hours: 6, minutes: 30 },
          title: "Bolder Boulder",
          description: "Annual 10-kilometer run in Boulder, Colorado",
          location: "Folsom Field, University of Colorado (finish line)",
          url: "http://www.bolderboulder.com/",
          geo: { lat: 40.0095, lon: 105.2669 },
          categories: ["10k races", "Memorial Day Weekend", "Boulder CO"],
          status: "CONFIRMED",
          busyStatus: "BUSY",
          organizer: { name: "Admin", email: "Race@BolderBOULDER.com" },
          attendees: [
            {
              name: "Adam Gibbons",
              email: "adam@example.com",
              rsvp: true,
              partstat: "ACCEPTED",
              role: "REQ-PARTICIPANT",
            },
          ],
        },
      ];
      return (
        <div>
          <button
            data-testid="trigger-btn"
            onClick={() => generateICalendarFile(mockEvent)}
          >
            Generate
          </button>
        </div>
      );
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes correctly", () => {
    const { getByTestId } = render(<App />);
    const trigger = getByTestId("trigger-btn");
    expect(String(trigger.textContent)).toEqual("Generate");
  });

  it("[IE] downloads .ics file correctly", async () => {
    global.URL.revokeObjectURL = jest.fn();
    global.ActiveXObject = true;
    createEvents.mockImplementation((events, callback) =>
      callback(false, true),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(useToast).toHaveBeenCalled();
    expect(createEvents).toHaveBeenCalled();
  });

  it("[non IE] downloads .ics file correctly", async () => {
    global.URL.revokeObjectURL = jest.fn();
    global.ActiveXObject = false;
    createEvents.mockImplementation((events, callback) =>
      callback(false, true),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(useToast).toHaveBeenCalled();
    expect(createEvents).toHaveBeenCalled();
  });

  it("[with window.webkitURL] downloads .ics file correctly", async () => {
    global.URL = null;
    global.webkitURL.revokeObjectURL = jest.fn();
    global.ActiveXObject = false;
    createEvents.mockImplementation((events, callback) =>
      callback(false, true),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(useToast).toHaveBeenCalled();
    expect(createEvents).toHaveBeenCalled();
  });

  it("[with window.URL] downloads .ics file correctly", async () => {
    global.URL.revokeObjectURL = jest.fn();
    global.ActiveXObject = false;
    createEvents.mockImplementation((events, callback) =>
      callback(false, true),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(useToast).toHaveBeenCalled();
    expect(createEvents).toHaveBeenCalled();
  });

  it("fails to download .ics file correctly", async () => {
    createEvents.mockImplementation((events, callback) =>
      callback(new Error("error"), false),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(useToast).toHaveBeenCalled();
    expect(createEvents).toHaveBeenCalled();
  });
});

