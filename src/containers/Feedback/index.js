import React from "react";

import {
  Text,
  VStack,
  Textarea,
  HStack,
  Box,
  Button,
  useColorModeValue,
  Image,
  useToast,
} from "@chakra-ui/react";
import Helmet from "react-helmet";
import { StarIcon } from "@chakra-ui/icons";
import styled from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import bauhaus from "assets/Feedback/Page/bauhaus-feedback-1.png";
import bauhaus2 from "assets/Feedback/Page/bauhaus-feedback-2.png";
import bauhaus3 from "assets/Feedback/Page/bauhaus-feedback-3.png";
import bauhaus4 from "assets/Feedback/Page/bauhaus-feedback-4.png";
import { createReview } from "services/api";
import { makeAtLeastMs } from "utils/promise";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const theme = useColorModeValue("light", "dark");
  const toast = useToast();
  const auth = useSelector((state) => state.auth);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    const ratingValue = rating;
    const message = comment;
    const userId = auth.userId;
    try {
      await makeAtLeastMs(createReview(userId, ratingValue, message), 1000);
      setRating(0);
      setComment("");
      toast({
        title: "Thank you for your feedback!",
        status: "success",
        duration: 2500,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        status: "error",
        duration: 2500,
        position: "bottom",
      });
    }
  };

  return (
    <MainContainer>
      <Helmet title="Ulasan" />
      <Box
        position="absolute"
        top="0px"
        left="0px"
        width="150px"
        display={{ base: "none", lg: "block" }}
      >
        <Image src={bauhaus} alt="Bauhaus" />
      </Box>
      <Box
        position="absolute"
        top="0px"
        right="0px"
        width="150px"
        display={{ base: "none", lg: "block" }}
      >
        <Image src={bauhaus2} alt="Bauhaus" />
      </Box>
      <Box
        position="absolute"
        bottom="0px"
        left="0px"
        width="250px"
        display={{ base: "none", lg: "block" }}
      >
        <Image src={bauhaus3} alt="Bauhaus" />
      </Box>
      <Box
        position="absolute"
        bottom="0px"
        right="0px"
        width="250px"
        display={{ base: "none", lg: "block" }}
      >
        <Image src={bauhaus4} alt="Bauhaus" />
      </Box>
      <FeedbackForm>
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          textAlign="center"
          color={theme === "dark" ? "dark.LightPurple" : "primary.Purple"}
        >
          Berikan kami Ulasan!
        </Text>
        <Text
          fontSize={{ md: "md", lg: "xl" }}
          fontWeight="light"
          textAlign="center"
          color={theme === "dark" ? "#E4E4E7" : "secondary.Gray"}
        >
          Bagaimana pengalaman Anda dalam menggunakan SusunJadwal?
        </Text>
        <VStack spacing={4} align="center">
          <HStack>
            <Text
              fontSize={{ base: "0px", md: "xs", lg: "sm" }}
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
                  boxSize={{ base: 16, md: 20, lg: 24 }}
                  padding={{ base: 4, md: 6 }}
                  color={i < rating ? "yellow.300" : "gray.300"}
                  transition="color 0.5s"
                  cursor="pointer"
                  onClick={() => handleRating(i + 1)}
                />
              ))}
            <Text
              fontSize={{ base: "0px", md: "xs", lg: "sm" }}
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
            size="md"
            borderRadius="12px"
            borderColor={theme === "dark" ? "gray.600" : "gray.300"}
            background={theme === "dark" ? "#27272A" : "white"}
            color={theme === "dark" ? "white" : "black"}
            height="250px"
          />
          <Box
            width="100%"
            fontSize="14px"
            fontWeight="semibold"
            textAlign="right"
            color="primary.Purple"
          >
            {comment.length}/300
          </Box>
        </VStack>
        <Button
          colorScheme="purple"
          onClick={handleSubmit}
          width="100%"
          padding="24px"
          marginTop="24px"
          borderRadius="12px"
          fontSize="lg"
          disabled={rating === 0}
        >
          Submit
        </Button>
      </FeedbackForm>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: -36px -80px 0 -80px;
  height: 91vh;

  @media (max-width: 768px) {
    margin: 0px;
    height: auto;
  }
`;

const FeedbackForm = styled.div`
  padding-top: 56px !important;
  padding-bottom: 100px !important;
  width: 100%;
  max-width: 700px;

  @media (max-width: 768px) {
    padding: 0 !important;
  }
`;
