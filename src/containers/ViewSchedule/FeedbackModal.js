import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Textarea,
  HStack,
  useColorModeValue,
  Box,
  Image,
  useToast,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import bauhaus from 'assets/Feedback/Modal/bauhaus-feedback-1.png';
import bauhaus2 from 'assets/Feedback/Modal/bauhaus-feedback-2.svg';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const theme = useColorModeValue("light", "dark");
  const toast = useToast();

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    const ratingValue = rating;
    const message = comment;

    // handle submit API

    onClose();
    toast({
      title: "Thank you for your feedback!",
      status: "success",
      duration: 2500,
      position: "bottom",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="24px"
        padding={{ base: "0px", md: "24px" }}
        paddingY={{ base: "24px", md: "48px" }}
        maxWidth="700px"
        width="90%"
        background={theme === "dark" ? "#18181B" : "white"}
        color={theme === "dark" ? "white" : "black"}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" top="0" left="0" width={{ base: '35px', md: '50px' }}>
          <Image src={bauhaus} alt="Bauhaus" />
        </Box>
        <Box position="absolute" bottom="0" right="0" width={{ base: '35px', md: '50px' }}>
          <Image src={bauhaus2} alt="Bauhaus" />
        </Box>
        <ModalHeader>
          <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" textAlign="center" color={theme === "dark" ? "dark.LightPurple" : "primary.Purple"} marginTop={{ base: '20px', md: '0px' }}>
            Berikan kami Ulasan!
          </Text>
          <Text fontSize={{ base: '15px', md: 'md' }} fontWeight="light" textAlign="center" color={theme === "dark" ? "#E4E4E7" : "secondary.Gray"} marginBottom={{ base: '-20px', md: '0px' }}>
            Bagaimana pengalaman Anda dalam menggunakan SusunJadwal?
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={{ base: 2, md: 4 }} align="center">
            <HStack>
              <Text
                fontSize={{ base: "0px", md: "sm" }}
                textAlign="center"
                fontWeight="semibold"
                color={theme === "dark" ? "#E4E4E7" : "secondary.Gray"}
              >
                Sangat<br></br>Tidak Puas
              </Text>
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    boxSize={{ base: 12, md: 16, lg: 20 }}
                    padding={{ base: 2, md: 3, lg: 5 }}
                    color={i < rating ? "yellow.300" : "gray.300"}
                    transition="color 0.5s"
                    cursor="pointer"
                    onClick={() => handleRating(i + 1)}
                  />
                ))}
              <Text
                fontSize={{ base: "0px", md: "sm" }}
                textAlign="center"
                fontWeight="semibold"
                color={theme === "dark" ? "#E4E4E7" : "secondary.Gray"}
              >
                Sangat<br></br>Puas
              </Text>
            </HStack>
            <Textarea
              placeholder="Tulis tanggapan-mu di sini (Opsional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={300}
              size={'md'}
              fontSize={{ base: '16px', md: 'md' }}
              borderRadius="12px"
              borderColor={theme === "dark" ? "gray.600" : "gray.300"}
              background={theme === "dark" ? "#27272A" : "white"}
              color={theme === "dark" ? "white" : "black"}
              height={{ base: '150px', md: '200px', lg: '250px' }}
            />
            <Box width="100%" fontSize={{ base: '12px', md: '14px' }} fontWeight="semibold" textAlign="right" color="primary.Purple">
              {comment.length}/300
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            width="100%"
            padding={{ base: '12px', md: '24px' }}
            borderRadius="12px"
            fontSize={{ base: 'sm', md: 'lg' }}
            disabled={rating === 0}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
