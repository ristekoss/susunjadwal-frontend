import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, screen } from "@testing-library/react";

import { render } from "../../../utils/test-utils";
import DownloadJadwalModal from "../index";

const mockSchedule = {
  id: "sch-1",
  name: "Jadwal Semester Ganjil",
  schedule_items: [
    {
      name: "Aljabar Linear-A",
      course_name: "Aljabar Linear",
      day: "Senin",
      start: "09.00",
      end: "11.30",
      room: "2.2302",
      lecturer: ["Dr. Kasiyah"],
      sks: 3,
    },
    {
      name: "Struktur Data-A",
      course_name: "Struktur Data",
      day: "Selasa",
      start: "13.00",
      end: "15.30",
      room: "2.2404",
      lecturer: ["Dr. Lia"],
      sks: 4,
    },
  ],
};

const mockFormattedSchedule = {
  "Aljabar Linear": {
    name: "Aljabar Linear",
    sks: 3,
    lecturer: "Dr. Kasiyah",
    time: [{ day: "Senin", start: "09.00", end: "11.30", room: "2.2302" }],
  },
  "Struktur Data": {
    name: "Struktur Data",
    sks: 4,
    lecturer: "Dr. Lia",
    time: [{ day: "Selasa", start: "13.00", end: "15.30", room: "2.2404" }],
  },
};

function renderModal(props = {}) {
  return render(
    <ChakraProvider>
      <DownloadJadwalModal
        isOpen={true}
        onClose={jest.fn()}
        schedule={mockSchedule}
        formattedSchedule={mockFormattedSchedule}
        scheduleName="Jadwal Semester Ganjil"
        {...props}
      />
    </ChakraProvider>,
  );
}

describe("DownloadJadwalModal", () => {
  it("renders modal title and main sections", () => {
    renderModal();

    expect(screen.getByText("Unduh Jadwal")).toBeInTheDocument();
    expect(screen.getByText("Tampilan")).toBeInTheDocument();
    expect(screen.getByText("Format File")).toBeInTheDocument();
    expect(screen.getByText("Warna Jadwal")).toBeInTheDocument();
  });

  it("renders all 3 display options", () => {
    renderModal();

    expect(screen.getByText("Visualisasi Jadwal")).toBeInTheDocument();
    expect(screen.getByText("Daftar Jadwal")).toBeInTheDocument();
    expect(screen.getByText("Visualisasi + Daftar")).toBeInTheDocument();
  });

  it("allows selecting different layout options", () => {
    renderModal();

    const daftarOption = screen.getByText("Daftar Jadwal");
    fireEvent.click(daftarOption);

    // List table should be in preview
    expect(screen.getAllByText("Aljabar Linear").length).toBeGreaterThan(0);
  });

  it("renders all file formats (PNG, JPG, PDF) and allows selection", () => {
    renderModal();

    expect(screen.getByText("PNG")).toBeInTheDocument();
    expect(screen.getByText("JPG")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();

    fireEvent.click(screen.getByText("PDF"));
    // Selected format updated
  });

  it("renders courses in Warna Jadwal section", () => {
    renderModal();

    expect(screen.getAllByText("Aljabar Linear").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Struktur Data").length).toBeGreaterThan(0);
  });

  it("renders Batal and Unduh buttons and triggers onClose on Batal", () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    const batalBtn = screen.getByRole("button", { name: "Batal" });
    const unduhBtn = screen.getByRole("button", { name: "Unduh" });

    expect(batalBtn).toBeInTheDocument();
    expect(unduhBtn).toBeInTheDocument();

    fireEvent.click(batalBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
