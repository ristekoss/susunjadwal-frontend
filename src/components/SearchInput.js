import React, { useState, useEffect, useCallback } from "react";
import { Input, Box } from "@chakra-ui/react";
import styled from "styled-components";

const filterMethod = (options, value) => {
  return options?.filter((option) => {
    const queryIsNotEmpty = value !== ""
    const isQueryMatch = option.name.toLowerCase().startsWith(value.toLowerCase())

    // When value is not empty & matches the query
    if (queryIsNotEmpty && isQueryMatch) {
      return option;
    }

    return null;
  })
}

function SearchInput({ theme, isMobile, options, setValue, placeholder, customFilter = filterMethod  }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onChangeHandler = useCallback(
    (value) => {
      let matches = [];
      matches = customFilter(options, value)
      setSuggestions(matches);
    },
    [options, customFilter],
  );

  useEffect(() => {
    onChangeHandler("");
  }, [onChangeHandler]);

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
        placeholder={placeholder}
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
            setShowSuggestions(false);
          } else {
            setShowSuggestions(true);
          }
        }}
      />

      {suggestions && suggestions.length > 0 ? (
        <SuggestionsBox
          style={{
            visibility: showSuggestions ? "visible" : "hidden",
            background: theme === "light" ? "#E4E4E4" : "#1D1D1D",
            color: theme === "light" ? "#000000" : "#FFFFFFCC",
            top: isMobile ? "45px" : "58px",
            fontSize: isMobile && "14px",
          }}
        >
          {suggestions &&
            suggestions.map((suggestion, idx) => (
              <Box
                key={idx}
                _hover={{
                  background: theme === "light" ? "#DED2FF" : "#674DE066",
                }}
              >
                <SuggestionsBoxItem
                  onMouseDown={() => suggestionClicked(suggestion.name)}
                  style={{
                    paddingLeft: isMobile ? "52px" : "58px",
                  }}
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
  border-radius: 8px;
  border: 1px solid #82828299;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const SuggestionsBoxItem = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 20px;
  cursor: pointer;
`;
