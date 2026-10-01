import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalBody,
  Button,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import styled from "styled-components";
import updatePassword from "assets/update-password.svg";

/**
 * Reminder shown before the user proceeds to SSO login: if their SSO
 * password has not been updated, they might not be able to log in.
 */
function SsoPasswordReminderModal({
  isOpen,
  onClose,
  onSignIn,
  onUpdatePassword,
}) {
  const theme = useColorModeValue("light", "dark");
  const isDark = theme === "dark";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mode={theme}>
        <ModalBody>
          <IconWrapper>
            <Image alt="Update Password" src={updatePassword} />
          </IconWrapper>
          <ModalTitle mode={theme}>Perbarui Password SSO Kamu</ModalTitle>
          <ModalDescription mode={theme}>
            Untuk memastikan proses login ke SusunJadwal berjalan lancar,
            pastikan password SSO kamu sudah diperbarui. Password yang belum
            diperbarui dapat menyebabkan kamu tidak dapat login ke SusunJadwal.
          </ModalDescription>
          <ModalDescription mode={theme}>
            Silakan perbarui password SSO kamu terlebih dahulu sebelum melakukan
            login.
          </ModalDescription>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            bg={isDark ? "primary.LightPurple" : "secondary.Purple"}
            borderColor="secondary.Purple"
            color={isDark ? "primary.LightPurple" : "primary.Purple"}
            fontWeight="medium"
            onClick={onUpdatePassword}
          >
            Update Password Sekarang
          </Button>
          <Button
            variant="solid"
            bg={isDark ? "primary.LightPurple" : "primary.Purple"}
            color={isDark ? "dark.White" : "white"}
            onClick={onSignIn}
            fontWeight="medium"
          >
            Sign In Sekarang
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const ModalContent = styled(ChakraModalContent).attrs({
  padding: { base: "24px 16px", lg: "32px 24px" },
  width: { base: "90%", lg: "560px" },
  maxWidth: { base: "90%", lg: "560px" },
  textAlign: "center",
})`
  background: ${({ mode }) => (mode === "dark" ? "#2C2C2C" : "#FFFFFF")};
  border-radius: 16px;
`;

const ModalFooter = styled(ChakraModalFooter).attrs({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: { base: "column", lg: "row" },
  marginTop: { base: "16px", lg: "24px" },
})`
  button {
    margin: 0px 4px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: ${({ mode }) => (mode === "dark" ? "#F4F4F4" : "#333333")};
  margin-bottom: 12px;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: ${({ mode }) => (mode === "dark" ? "#D0D0D0" : "#666666")};
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export default SsoPasswordReminderModal;
