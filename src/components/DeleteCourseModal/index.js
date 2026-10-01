import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import styled from "styled-components";
import trashIllustration from "assets/trash-course.svg";

export const DONT_SHOW_DELETE_MODAL_KEY = "dontShowDeleteCourseModal";

const TableHeader = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ isDark }) => (isDark ? "#FFFFFF" : "#000000")};
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ isDark }) => (isDark ? "#424242" : "#E2E8F0")};
  margin-bottom: 12px;
`;

const TableRow = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 22px;
  color: ${({ isDark }) => (isDark ? "#FFFFFF" : "#000000")};
  align-items: flex-start;
`;

const IllustrationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const TrashImg = styled.img`
  width: 100%;
  max-width: 320px;
  height: auto;
  display: block;
`;

function DeleteCourseModal({ isOpen, onClose, onConfirm, course }) {
  const isDark = useColorModeValue(false, true);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!course) return null;

  const courseName = course.parentName || course.name || "";
  const className = course.name || "";
  const credit = course.credit || 0;
  const scheduleItems = course.schedule_items || [];

  const handleConfirm = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(DONT_SHOW_DELETE_MODAL_KEY, "true");
      } catch (e) {
        // ignore localStorage errors
      }
    }
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    setDontShowAgain(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent
        bg={isDark ? "#2C2C2C" : "#FFFFFF"}
        color={isDark ? "#D0D0D0" : "#333333"}
        borderRadius="16px"
        p={{ base: "24px 20px 32px", md: "32px 40px 40px" }}
        mx="16px"
        maxW="560px"
        position="relative"
      >
        <ModalCloseButton
          top="24px"
          right="24px"
          size="md"
          color={isDark ? "#A0AEC0" : "#5038BC"}
          _hover={{ bg: isDark ? "whiteAlpha.200" : "blackAlpha.100" }}
        />

        <ModalBody p={0}>
          <IllustrationWrapper>
            <TrashImg src={trashIllustration} alt="Hapus Mata Kuliah" />
          </IllustrationWrapper>

          <Text
            fontFamily="Poppins"
            fontWeight="700"
            fontSize={{ base: "24px", md: "30px" }}
            lineHeight={{ base: "30px", md: "36px" }}
            textAlign="center"
            mb="20px"
            color={isDark ? "#FFFFFF" : "#000000"}
          >
            Hapus Mata Kuliah Ini?
          </Text>

          <Box mb="20px" w="100%">
            <TableHeader isDark={isDark}>
              <Box flex="1.3" textAlign="left">
                Kelas
              </Box>
              <Box flex="2.2" textAlign="left">
                Waktu
              </Box>
              <Box flex="0.7" textAlign="center">
                SKS
              </Box>
            </TableHeader>

            <TableRow isDark={isDark}>
              <Box
                flex="1.3"
                textAlign="left"
                pr="2"
                color={isDark ? "#FFFFFF" : "#000000"}
              >
                {className}
              </Box>
              <Box flex="2.2" textAlign="left" pr="2">
                {scheduleItems.length > 0 ? (
                  <Box
                    as="ul"
                    pl="20px"
                    m={0}
                    style={{ listStyleType: "disc" }}
                  >
                    {scheduleItems.map((item, idx) => (
                      <Box
                        as="li"
                        key={idx}
                        fontSize="14px"
                        lineHeight="22px"
                        color={isDark ? "#FFFFFF" : "#000000"}
                      >
                        {item.day}, {item.start}-{item.end}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Text fontSize="14px" color={isDark ? "#FFFFFF" : "#000000"}>
                    -
                  </Text>
                )}
              </Box>
              <Box
                flex="0.7"
                textAlign="center"
                color={isDark ? "#FFFFFF" : "#000000"}
              >
                {credit}
              </Box>
            </TableRow>
          </Box>

          <Text
            fontSize={{ base: "14px", md: "16px" }}
            lineHeight={{ base: "20px", md: "24px" }}
            textAlign="center"
            mb="24px"
            color={isDark ? "#FFFFFF" : "#000000"}
          >
            Tindakan ini akan menghapus mata kuliah{" "}
            <Text as="span" fontWeight="600">
              {courseName} ({credit} SKS)
            </Text>{" "}
            dari jadwalmu. Kamu yakin ingin melanjutkan?
          </Text>

          <Flex align="center" justify="flex-start" mb="24px">
            <Checkbox
              isChecked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              colorScheme="purple"
              borderColor={isDark ? "#5038BC" : "#5038BC"}
              iconColor="white"
              size="md"
              sx={{
                ".chakra-checkbox__control": {
                  borderRadius: "4px",
                  borderColor: "#5038BC",
                  _checked: {
                    bg: "#5038BC",
                    borderColor: "#5038BC",
                  },
                },
              }}
            >
              <Text
                fontSize="14px"
                fontWeight="500"
                color={isDark ? "#FFFFFF" : "#000000"}
                userSelect="none"
              >
                Jangan tampilkan pesan ini lagi
              </Text>
            </Checkbox>
          </Flex>

          <Flex gap="18px" direction={{ base: "column-reverse", sm: "row" }}>
            <Button
              flex="1"
              bg={isDark ? "#C9CEFC" : "#C9CEFC"}
              color="#45349F"
              _hover={{
                bg: "#B8BDF8",
              }}
              _active={{
                bg: "#A8ADF9",
              }}
              onClick={handleClose}
              h="48px"
              borderRadius="8px"
              fontSize="16px"
              fontWeight="500"
            >
              Batal
            </Button>
            <Button
              flex="1"
              bg="#FB2C36"
              color="#FFFFFF"
              _hover={{
                bg: "#E0242E",
              }}
              _active={{
                bg: "#C81E27",
              }}
              onClick={handleConfirm}
              h="48px"
              borderRadius="8px"
              fontSize="16px"
              fontWeight="500"
            >
              Ya, Hapus
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default DeleteCourseModal;
