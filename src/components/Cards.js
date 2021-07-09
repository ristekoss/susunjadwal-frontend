import React from "react";
import { Box, Image, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

export const ContributorCard = () => {
  return (
    <LinkBox
      maxW="389px"
      d="flex"
      p={{base:"1rem", sm:'36px'}}
      justifyContent="space-between"
      as="article"
      borderWidth="1px"
      rounded="md"
      borderRadius="8px"
      border="2px"
      borderColor="transparent"
      bg="primary.Alabaster"
      _hover={{
        bg: "primary.White",
        borderColor: "primary.Purple",
      }}
    >
      <Image
        borderRadius="full"
        boxSize="96px"
        objectFit="contain"
        src="https://bit.ly/sage-adebayo"
        alt="Segun Adebayo"
      />
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          <LinkOverlay
            _hover={{ color: "Black" }}
            _focus={{ color: "Black" }}
            href="#"
          >
            Sage Adebayo
          </LinkOverlay>
        </Text>
        <Text>Backend Developer</Text>
      </Box>
    </LinkBox>
  );
};
