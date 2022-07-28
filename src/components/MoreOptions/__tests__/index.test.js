import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MoreOptions from "components/MoreOptions/MoreOptions";
import useDownloadCalendar from "hooks/useDownloadCalendar";

const { generateICalendarFile } = useDownloadCalendar();

const mockMoreOptionsProps = {
  items: [
    {
      text: "Bagikan Jadwal",
      props: {
        onClick: () => console.info(1),
      },
    },
    {
      text: "Download Jadwal",
      props: {
        onClick: (event) => {
          generateICalendarFile(event);
        },
      },
    },
    {
      text: "Hapus Jadwal",
      props: {
        style: { color: "red" },
        onClick: () => console.info(3),
      },
    },
  ],
};
it("renders component", async () => {
  render(<MoreOptions {...mockMoreOptionsProps} />);
  const trigger = screen.getByTestId("more-options-trigger");
  await waitFor(() => expect(trigger).toBeInTheDocument());

  // Click button
  fireEvent.click(trigger);

  // Wait for page to update with query text
  const items = screen.getByTestId("more-options-content");
  expect(items.childElementCount).toBe(3);

  expect(screen.getByText("Bagikan Jadwal")).toBeInTheDocument();
  expect(screen.getByText("Download Jadwal")).toBeInTheDocument();
  expect(screen.getByText("Hapus Jadwal")).toBeInTheDocument();
});
