import React, { useState } from "react";
import { Input, Box } from "@chakra-ui/react";
import styled from "styled-components";
function SearchInput({ theme, isMobile, courses, setValue }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onChangeHandler = (value) => {
    let matches = [];

    matches = courses?.filter((c) => {
      if (value === "") {
        //if value is empty
        return null;
      } else if (c.name.toLowerCase().startsWith(value.toLowerCase())) {
        //returns suggestions array
        return c;
      } else {
        return null;
      }
    });

    setSuggestions(matches);
  };

  const suggestionClicked = (name) => {
    document.getElementById("input").value = name;
    setValue(name);
    setShowSuggestions(false);
  };

  return (
    <>
      <Input
        id="input"
        onChange={(e) => onChangeHandler(e.target.value)}
        onBlur={() => setShowSuggestions(false)}
        onMouseDown={() => setShowSuggestions(true)}
        placeholder="Cari matkul"
        color={theme === "light" ? "#000000" : "#ffffff"}
        h="full"
        pl={isMobile ? "52px" : "58px"}
        pr="20px"
        borderRadius="8px"
        borderRightRadius={!isMobile && "0"}
        borderColor={
          theme === "light" ? "primary.Purple" : "primary.LightPurple"
        }
        bg="transparent"
        _hover={{}}
        textOverflow="ellipsis"
        fontSize={isMobile && "14px"}
        style={{ position: "relative" }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setValue(e.target.value);
          }
        }}
      />

      {suggestions.length > 0 ? (
        <SuggestionsBox
          style={{
            visibility: showSuggestions ? "visible" : "hidden",
            background: theme === "light" ? "#E4E4E4" : "#1D1D1D",
            color: theme === "light" ? "#000000" : "#FFFFFFCC",
          }}
        >
          {suggestions &&
            suggestions.map((suggestion, i) => (
              <Box
                _hover={{
                  background: theme === "light" ? "#DED2FF" : "#674DE066",
                }}
              >
                <SuggestionsBoxItem
                  onMouseDown={() => suggestionClicked(suggestion.name)}
                >
                  {suggestion.name}
                </SuggestionsBoxItem>
              </Box>
            ))}
        </SuggestionsBox>
      ) : null}
    </>
  );
}
export default SearchInput;

export const SuggestionsBox = styled.div`
  position: absolute;
  z-index: 4;
  width: 100%;
  height: auto;
  top: 58px;
  border-radius: 8px;
  border: 1px solid #82828299;
  padding-top: 10px;
  padding-bottom: 10px;
`;
export const SuggestionsBoxItem = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 60px;
  padding-right: 60px;
  cursor: pointer;
`;
