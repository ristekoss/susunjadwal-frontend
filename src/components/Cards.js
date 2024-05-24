import React from "react";
import {
  Box,
  Image,
  Flex,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa6";

export const ContributorCard = ({ name, avatar, github, contributions }) => {
  const theme = useColorModeValue("light", "dark");
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
      bg={theme === "light" ? "primary.Alabaster" : "secondary.MineShaft"}
      _hover={{
        bg: theme === "light" ? "primary.White" : "dark.Black",
        borderColor: theme === "light" ? "primary.Purple" : "dark.LightPurple",
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
          <Box
            _hover={{ color: theme === "light" ? "Black" : "dark.White" }}
            _focus={{ color: theme === "light" ? "Black" : "dark.White" }}
          >
            {name}
          </Box>
        </Text>
        <Text fontSize={{ base: "xs", md: "md" }}>
          {contributions} contribution{contributions !== 1 && "s"}
        </Text>
        <Flex align="center" mt="1rem">
          <Text
            as="a"
            d="block"
            href={github}
            fontSize={{ base: "xs", md: "md" }}
            color={theme === "light" ? "" : "dark.LightPurple"}
            _hover={{
              color: theme === "light" ? "Black" : "dark.Purple",
            }}
          >
            <Icon
              boxSize={"1.2rem"}
              as={FaGithub}
              color={theme === "light" ? "Black" : "dark.LightPurple"}
            />{" "}
            Github
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
