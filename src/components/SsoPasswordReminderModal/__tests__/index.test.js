import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, screen } from "@testing-library/react";

import { render } from "../../../utils/test-utils";
import SsoPasswordReminderModal from "../index";

function renderModal(props = {}) {
  return render(
    <ChakraProvider>
      <SsoPasswordReminderModal
        isOpen
        onClose={jest.fn()}
        onSignIn={jest.fn()}
        onUpdatePassword={jest.fn()}
        {...props}
      />
    </ChakraProvider>,
  );
}

describe("SsoPasswordReminderModal", () => {
  it("renders the title and reminder copywriting when open", () => {
    renderModal();

    expect(screen.getByText("Perbarui Password SSO Kamu")).toBeInTheDocument();
    expect(
      screen.getByText(/pastikan password SSO kamu sudah diperbarui/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Silakan perbarui password SSO kamu terlebih dahulu sebelum melakukan login/i,
      ),
    ).toBeInTheDocument();
  });

  it("does not render anything when closed", () => {
    renderModal({ isOpen: false });

    expect(
      screen.queryByText("Perbarui Password SSO Kamu"),
    ).not.toBeInTheDocument();
  });

  it("renders both CTA buttons", () => {
    renderModal();

    expect(
      screen.getByRole("button", { name: /Sign In Sekarang/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Update Password Sekarang/i }),
    ).toBeInTheDocument();
  });

  it("calls onSignIn when the Sign In button is clicked", () => {
    const onSignIn = jest.fn();
    const onUpdatePassword = jest.fn();
    renderModal({ onSignIn, onUpdatePassword });

    fireEvent.click(screen.getByRole("button", { name: /Sign In Sekarang/i }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onUpdatePassword).not.toHaveBeenCalled();
  });

  it("calls onUpdatePassword when the Update Password button is clicked", () => {
    const onSignIn = jest.fn();
    const onUpdatePassword = jest.fn();
    renderModal({ onSignIn, onUpdatePassword });

    fireEvent.click(
      screen.getByRole("button", { name: /Update Password Sekarang/i }),
    );

    expect(onUpdatePassword).toHaveBeenCalledTimes(1);
    expect(onSignIn).not.toHaveBeenCalled();
  });
});
