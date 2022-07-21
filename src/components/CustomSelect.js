import React from "react";
import { Select, Flex, Text } from "@chakra-ui/react";

export const CustomSelect = ({
  register,
  name,
  label,
  children,
  disabled,
  mr,
  ml,
  mode,
}) => (
  <Flex mr={mr} ml={ml} mb="3" h="57px" flex="50%">
    <Text
      display="flex"
      bg={mode === "light" ? "#E5E5E5" : "#222222"}
      alignItems="center"
      justifyContent="center"
      maxW="158px"
      borderRadius="8px"
      borderRightRadius="0"
      borderWidth="2px"
      borderColor={mode === "light" ? "primary.Purple" : "primary.LightPurple"}
      fontWeight="600"
      color={mode === "light" ? "primary.Purple" : "primary.DarkPurple"}
      textAlign="center"
      w="45%"
    >
      {label}
    </Text>

    <Select
      id={name}
      placeholder={"Pilih " + label}
      disabled={disabled}
      color={mode === "light" ? "#000000" : "#ffffff"}
      textTransform="capitalize"
      h="57px"
      bg={mode === "light" ? "transparent" : "#222222"}
      borderRadius="8px"
      borderLeftRadius="0"
      borderWidth="2px"
      borderLeftWidth="0"
      borderColor={mode === "light" ? "primary.Purple" : "primary.LightPurple"}
      _hover={{
        borderColor:
          mode === "light" ? "primary.Purple" : "primary.LightPurple",
      }}
      _focus={{
        outline: "none",
      }}
      {...register(name)}
    >
      {children}
    </Select>
  </Flex>
);
