import React from "react";
import { Box, Image, Flex, Text, Icon } from "@chakra-ui/react";
import { GoMarkGithub } from "react-icons/go";

export const ContributorCard = ({ name, avatar, github, contributions }) => {
  return (
    <Box
      maxW="400px"
      d="flex"
      p={{ base: "1rem", sm: "36px" }}
      justifyContent="space-between"
      gridGap={{ base: "1.25rem", md: "2rem" }}
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
        src={avatar}
        alt={name}
      />
      <Box>
        <Text fontWeight="bold" fontSize={{ base: "sm", md: "lg" }}>
          <Box _hover={{ color: "Black" }} _focus={{ color: "Black" }}>
            {name}
          </Box>
        </Text>
        <Text fontSize={{ base: "xs", md: "md" }}>
          {contributions} contributions
        </Text>
        <Flex align='center' mt="1rem">
          <Text
            as="a"
            d="block"
            href={github}
            fontSize={{ base: "xs", md: "md" }}
          >
            <Icon boxSize={"1.2rem"} as={GoMarkGithub} /> Github
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
