import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalCloseButton,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";

const CompareModal = ({ isOpen, onClose, scheduleId }) => {
  const history = useHistory();
  const [friendLink, setFriendLink] = useState("");
  const [error, setError] = useState("");
  const initialRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFriendLink("");
      setError("");
    }
  }, [isOpen]);

  const handleCompare = () => {
    if (!friendLink) {
      setError("Link jadwal teman tidak boleh kosong.");
      return;
    }
    if (!friendLink.includes("/jadwal/")) {
      setError("Format link jadwal tidak valid.");
      return;
    }
    const friendScheduleId = friendLink.split("/").pop();
    if (!friendScheduleId) {
      setError("Format link jadwal tidak valid.");
      return;
    }
    history.push(`/jadwal/compare?s1=${scheduleId}&s2=${friendScheduleId}`);
    onClose();
  };

  const handleChange = (e) => {
    setFriendLink(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{ base: "sm", md: "2xl" }}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent
        p="4"
        borderRadius="12px"
        w={{ base: "90%", md: "auto" }}
        maxW={{ md: "2xl" }}
      >
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" pt="8">
          Bandingkan Jadwal dengan Teman-mu!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel color="#5038BC" fontWeight="semibold">
              Link Jadwal Teman-mu
            </FormLabel>
            <Input
              ref={initialRef}
              placeholder="https://susunjadwal.cs.ui.ac.id/jadwal/..."
              value={friendLink}
              onChange={handleChange}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Flex w="full" justifyContent="space-between">
            <Button
              bg="#C9CEFC"
              color="#45349F"
              onClick={onClose}
              w="48%"
              fontWeight="medium"
              _hover={{ bg: "#453490", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              bg="#5038BC"
              color="white"
              w="48%"
              fontWeight="medium"
              onClick={handleCompare}
            >
              Bandingkan
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompareModal;
