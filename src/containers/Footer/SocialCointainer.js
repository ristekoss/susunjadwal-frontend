// src/containers/Footer/SocialContainer.js
import { useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ListIcon } from "./const";
import { StyledIconWrapper } from "./styles";

const SocialContainer = () => {
  const theme = useColorModeValue("light", "dark");

  return (
    <StyledIconWrapper>
      {ListIcon.map(({ url, icon: Icon }, id) => (
        <a target="_blank" rel="noopener noreferrer" key={id} href={url}>
          <Icon
            size="24px"
            style={{
              margin: "0 20px",
              color: theme === "light" ? "#333333" : "#D0D0D0",
            }}
          />
        </a>
      ))}
    </StyledIconWrapper>
  );
};

export default SocialContainer;
