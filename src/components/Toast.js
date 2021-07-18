import React from "react";
import {
  Box,
  createStandaloneToast,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningTwoIcon,
  WarningIcon
} from "@chakra-ui/icons";

const toast = createStandaloneToast();

const ToastType = {
  success: {
    color: "var(--chakra-colors-state-Success)",
    icon: <CheckCircleIcon boxSize={{ base: 6, lg: 8 }} color="white" />,
  },
  info: {
    color: "var(--chakra-colors-state-Info)",
    icon: <WarningIcon boxSize={{ base: 6, lg: 8 }} transform="auto" rotate="180deg" color="white" />,
  },
  error: {
    color: "var(--chakra-colors-state-Error)",
    icon: <WarningTwoIcon boxSize={{ base: 6, lg: 8 }} color="white" />,
  }
};

export const CustomToast = ({ message, type }) => {
  return (
    <Box
      borderRadius="8px"
      border="1px"
      borderColor={ToastType[type].color}
      d="flex"
      overflowWrap="break-word"
      maxW={{ base: "300px", lg: "600px" }}
      minH={{ base: "40px", lg: "50px" }}
      bg="var(--chakra-colors-primary-Alabaster)"
    >
      <Box
        borderLeftRadius="8px"
        w="60px"
        h="inherit"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={ToastType[type].color}
      >
        {ToastType[type].icon}
      </Box>
      <Box
        display="flex"
        style={{wordWrap: 'break-word'}}
        alignItems="center"
        px="1.2rem"
      >
        {message}
      </Box>
    </Box>
  );
};

export const SuccessToast = (message, isMobile=false) =>
  toast({
    duration: 3000,
    position: isMobile ? "top" : "top-right",
    render: () => <CustomToast type="success" message={message} />,
  })

export const InfoToast = (message, isMobile=false) =>
  toast({
    duration: 3000,
    position: isMobile ? "top" : "top-right",
    isClosable: true,
    render: () => <CustomToast type="info" message={message} />,
  });

  export const ErrorToast = (message, isMobile=false) =>
  toast({
    duration: 3000,
    position: isMobile ? "top" : "top-right",
    isClosable: true,
    render: () => <CustomToast type="error" message={message} />,
  });