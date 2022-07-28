import { render, cleanup, fireEvent, act } from "@testing-library/react";
import React, { useState } from "react";
import useDidUpdate from "../useDidUpdate";

describe("useDidUpdate", () => {
  let App;

  beforeEach(() => {
    App = function () {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      const valueIsGreaterThan0 = value > 0;
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, [valueIsGreaterThan0]);

      return (
        <div>
          <button data-testid="trigger-btn" onClick={() => setValue(value + 1)}>
            Add
          </button>
          <span data-testid="value">{value.toString()}</span>
          <span data-testid="element">{hasUpdated}</span>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("initializes correctly, does not called on first render", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
  });

  it("makes dependencies an array if given non array form", () => {
    const App2 = function () {
      const [value, setValue] = useState(0);
      useDidUpdate(() => {
        setValue(1);
      }, value);
      return <span data-testid="value">{value}</span>;
    };
    const { getByTestId } = render(<App2 />);
    const renderedElement = getByTestId("value");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
  });

  it("gets called if a state value changes", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(parseInt(String(renderedElement.textContent))).toEqual(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(parseInt(String(valueElement.textContent))).toEqual(1);
    expect(parseInt(String(renderedElement.textContent))).toEqual(1);
  });

  it("does not get called if state value has not updated", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(1);
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(1);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(2);
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(1);
  });
});

describe("useDidUpdate warn", () => {
  let App;
  const originalWarn = console.warn;

  beforeEach(() => {
    App = function () {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, []);

      return (
        <div>
          <button data-testid="trigger-btn" onClick={() => setValue(value + 1)}>
            Add
          </button>
          <span data-testid="value">{value.toString()}</span>
          <span data-testid="element">{hasUpdated}</span>
        </div>
      );
    };
  });
  afterEach(() => (console.warn = originalWarn));

  describe("Check console.warn() output", () => {
    let consoleOutput = [];
    const mockedWarn = (output) => consoleOutput.push(output);
    beforeEach(() => (console.warn = mockedWarn));

    it("has to show in console warning messages", () => {
      render(<App />);
      expect(consoleOutput).toEqual([
        "Using [] as the second argument makes useDidUpdate more like a componentDidMount.",
      ]);
    });
  });
});
