import React, { useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const HIDDEN_PATHS = ["/admin", "/feedback-recap", "/panduan"];

const FloatingHelpButton = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isMobile = useSelector((state) => state.appState.isMobile);
  const [isDismissed, setIsDismissed] = useState(false);

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  const handleClick = () => {
    history.push("/panduan");
  };

  const isEditPage = pathname.startsWith("/edit");
  const isSusunPage = pathname.startsWith("/susun");

  return (
    <Box
      position="fixed"
      bottom={{
        base: isMobile && (isEditPage || isSusunPage) ? "90px" : "20px",
        lg: "28px",
      }}
      right={{ base: "20px", lg: "28px" }}
      zIndex={1000}
    >
      <Button
        aria-label="Buka Panduan Pengguna"
        onClick={handleClick}
        borderRadius="full"
        px={5}
        py={3}
        bg="primary.Purple"
        color="primary.White"
        boxShadow="0 6px 18px rgba(80, 56, 188, 0.35)"
        _hover={{
          bg: "primary.LightPurple",
          boxShadow: "0 8px 22px rgba(80, 56, 188, 0.45)",
          transform: "translateY(-2px)",
        }}
        _active={{
          bg: "primary.LightPurple",
          transform: "translateY(0)",
        }}
        transition="all 0.2s ease"
      >
        💡Panduan
      </Button>
      <IconButton
        icon={<CloseIcon />}
        size="xs"
        variant="solid"
        position="absolute"
        top="-8px"
        right="-8px"
        borderRadius="full"
        aria-label="Tutup Panduan"
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissed(true);
        }}
        color="black"
        bg="#e2e8f0"
        _hover={{ bg: "gray.500" }}
      />
    </Box>
  );
};

export default FloatingHelpButton;
