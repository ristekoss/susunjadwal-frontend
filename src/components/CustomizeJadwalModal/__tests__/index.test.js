import React from "react";
import { createStore } from "redux";
import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, screen } from "@testing-library/react";

import reducer from "../../../redux/reducers";
import { render } from "../../../utils/test-utils";
import CustomizeJadwalModal from "../index";

function renderModal(props = {}, initialState = {}) {
  const store = createStore(reducer, initialState);
  return {
    ...render(
      <ChakraProvider>
        <CustomizeJadwalModal isOpen={true} onClose={jest.fn()} {...props} />
      </ChakraProvider>,
      { store },
    ),
    store,
  };
}

describe("CustomizeJadwalModal", () => {
  it("renders all form fields correctly", () => {
    renderModal();

    expect(screen.getByText("Customize Jadwal")).toBeInTheDocument();
    expect(screen.getByText(/Nama Jadwal/i)).toBeInTheDocument();
    expect(screen.getByText(/Hari Jadwal/i)).toBeInTheDocument();
    expect(screen.getByText(/Waktu Jadwal/i)).toBeInTheDocument();
    expect(screen.getByText(/Deskripsi/i)).toBeInTheDocument();
    expect(screen.getByText(/Lokasi/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Ketik nama jadwal di sini"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Tambahkan deskripsi atau catatan (opsional)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tambahkan lokasi pelaksanaan (opsional)"),
    ).toBeInTheDocument();
  });

  it("renders buttons Batal and Simpan", () => {
    renderModal();

    expect(screen.getByRole("button", { name: "Batal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simpan" })).toBeInTheDocument();
  });

  it("shows conflict alert when scheduled time overlaps with existing schedule", () => {
    const initialState = {
      schedules: [
        {
          name: "Aljabar Linear",
          parentName: "Aljabar Linear",
          schedule_items: [
            {
              day: "Senin",
              start: "09.00",
              end: "11.00",
              room: "A.101",
            },
          ],
        },
      ],
    };

    renderModal({}, initialState);

    const nameInput = screen.getByPlaceholderText("Ketik nama jadwal di sini");
    fireEvent.change(nameInput, { target: { value: "Belajar Kelompok" } });

    expect(screen.getByText("Jadwal bentrok")).toBeInTheDocument();
    expect(
      screen.getByText(/Jadwal ini bentrok dengan "Aljabar Linear"/i),
    ).toBeInTheDocument();
  });

  it("disables Simpan button when form is invalid or has conflict", () => {
    renderModal();

    const simpanBtn = screen.getByRole("button", { name: "Simpan" });
    expect(simpanBtn).toBeDisabled();
  });

  it("enables Simpan button when valid and dispatches addSchedule on save", () => {
    const { store } = renderModal({}, { schedules: [] });

    const nameInput = screen.getByPlaceholderText("Ketik nama jadwal di sini");
    fireEvent.change(nameInput, { target: { value: "Kegiatan Riset" } });

    const simpanBtn = screen.getByRole("button", { name: "Simpan" });
    expect(simpanBtn).not.toBeDisabled();

    fireEvent.click(simpanBtn);

    const state = store.getState();
    expect(state.schedules).toHaveLength(1);
    expect(state.schedules[0].name).toBe("Kegiatan Riset");
    expect(state.schedules[0].isCustom).toBe(true);
  });
});
