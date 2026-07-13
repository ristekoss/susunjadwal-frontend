import React from "react";
import { Button } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";

const HIDDEN_PATHS = ["/admin", "/feedback-recap", "/panduan"];

const FloatingHelpButton = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const handleClick = () => {
    history.push("/panduan");
  };

  return (
    <Button
      aria-label="Buka Panduan Pengguna"
      onClick={handleClick}
      position="fixed"
      bottom={{ base: "20px", lg: "28px" }}
      right={{ base: "20px", lg: "28px" }}
      zIndex={1000}
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
  );
};

export default FloatingHelpButton;
