import { fireEvent } from "@testing-library/react";
import React from "react";
const { createEvents } = require("ics");
import useDownloadCalendar from "../useDownloadCalendar";
import { mockFormattedSchedule } from "../__mocks__";
import { render } from "../../utils/test-utils";

jest.mock("ics", () => {
  return {
    createEvents: jest.fn(),
  };
});

describe("useDownloadCalendar", () => {
  let App;

  beforeEach(() => {
    App = function () {
      const { parseFormattedScheduleToEvent, generateICalendarFile } =
        useDownloadCalendar();
      return (
        <div>
          <button
            data-testid="trigger-btn"
            onClick={() =>
              generateICalendarFile(parseFormattedScheduleToEvent(mockFormattedSchedule))
            }
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
    expect(createEvents).toHaveBeenCalled();
  });

  it("fails to download .ics file correctly", async () => {
    createEvents.mockImplementation((events, callback) =>
      callback(new Error("error"), false),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(createEvents).toHaveBeenCalled();
  });

  it("correctly parses formattedSchedule to event", async () => {
    createEvents.mockImplementation((events, callback) =>
      callback(new Error("error"), false),
    );
    const dom = render(<App />);
    const trigger = dom.getByTestId("trigger-btn");
    fireEvent.click(trigger);
    expect(createEvents).toHaveBeenCalled();
  });
});
