import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Helmet from "react-helmet";
import { MdOutlineSearch, MdExpandMore, MdExpandLess } from "react-icons/md";
import styled from "styled-components";
import { RiArrowLeftLongLine } from "react-icons/ri";

import { BauhausSide } from "components/Bauhaus";
import { FAQ_LIST } from "./faqData";

import rubyFind from "assets/ruby-find.png";

import { useHistory } from "react-router-dom";

const UserGuide = () => {
  const theme = useColorModeValue("light", "dark");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set());

  const filteredFaqs = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase();
    if (!q) return FAQ_LIST;
    return FAQ_LIST.filter((item) => item.question.toLowerCase().includes(q));
  }, [submittedQuery]);

  const handleSearch = () => {
    setSubmittedQuery(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleRow = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const history = useHistory();

  return (
    <MainContainer>
      <Text
        as="button"
        onClick={() => history.goBack()}
        display="flex"
        alignItems="center"
        gap="12px"
        fontSize="1.5rem"
        border="none"
        bg="transparent"
        cursor="pointer"
      >
        <RiArrowLeftLongLine
          color="#5038BC"
          style={{
            fontSize: "2rem",
          }}
        />
        <Text color="#5038BC" fontWeight="medium">
          Kembali
        </Text>
      </Text>

      <Helmet title="Susun Jadwal User Guide" />
      <BauhausSide />

      <Box
        position="absolute"
        top="100px"
        left="-20px"
        width={{ base: "100px", lg: "240px" }}
        display={{ base: "none", lg: "block" }}
        zIndex={3}
      >
        <Image src={rubyFind} alt="Ruby mascot" objectFit="contain" />
      </Box>

      <Box textAlign="center" mt={{ base: "1rem", lg: "2rem" }} mb="2rem">
        <Text
          fontWeight="bold"
          fontSize={{ base: "x-large", md: "xx-large" }}
          color={theme === "light" ? "primary.Purple" : "dark.Purple"}
        >
          Susun Jadwal User Guide
        </Text>
      </Box>

      <SearchWrapper>
        <InputGroup
          h={{ base: "44px", md: "52px" }}
          size="md"
          sx={{
            "& > div": { zIndex: 2 },
          }}
        >
          <InputLeftElement
            h="full"
            pl={{ base: "10px", md: "14px" }}
            pointerEvents="none"
            children={
              <MdOutlineSearch
                size={20}
                color={theme === "light" ? "#917DEC" : "#917DEC"}
              />
            }
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari Kata Kunci"
            bg="primary.White"
            borderColor="primary.DarkPurple"
            borderWidth="1px"
            borderRadius="8px 0 0 8px"
            _focus={{
              borderColor: "primary.DarkPurple",
              boxShadow: "none",
            }}
            color={theme === "light" ? "secondary.MineShaft" : "dark.White"}
            h="full"
          />
        </InputGroup>
        <SearchButton
          onClick={handleSearch}
          bg="primary.Purple"
          color="primary.White"
          _hover={{ bg: "primary.LightPurple" }}
          _active={{ bg: "primary.LightPurple" }}
          borderRadius="0 8px 8px 0"
          h={{ base: "44px", md: "52px" }}
          px={{ base: "16px", md: "24px" }}
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="semibold"
        >
          Cari &gt;
        </SearchButton>
      </SearchWrapper>

      <FaqStack>
        {filteredFaqs.length === 0 && (
          <EmptyState mode={theme}>
            Tidak ada hasil untuk kata kunci tersebut.
          </EmptyState>
        )}

        {filteredFaqs.map((item) => {
          const isOpen = openIds.has(item.id);
          return (
            <FaqRow key={item.id} mode={theme}>
              <FaqHeader
                as="button"
                aria-expanded={isOpen}
                onClick={() => toggleRow(item.id)}
                mode={theme}
                isOpen={isOpen}
              >
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: "sm", md: "md" }}
                  textAlign="left"
                  color={theme === "light" ? "primary.Purple" : "dark.Purple"}
                >
                  {item.question}
                </Text>
                {isOpen ? (
                  <MdExpandLess size={22} color="#917DEC" />
                ) : (
                  <MdExpandMore size={22} color="#917DEC" />
                )}
              </FaqHeader>

              {isOpen && (
                <FaqBody mode={theme}>
                  {item.answer.map((block, idx) => {
                    if (block.type === "text") {
                      return (
                        <Text
                          key={idx}
                          fontSize={{ base: "sm", md: "md" }}
                          whiteSpace="pre-wrap"
                          color={
                            theme === "light"
                              ? "secondary.MineShaft"
                              : "dark.White"
                          }
                        >
                          {block.value}
                        </Text>
                      );
                    }
                    if (block.type === "list") {
                      return block.ordered ? (
                        <OrderedList key={idx}>
                          {block.items.map((line, i) => (
                            <li key={i}>
                              <Text
                                as="span"
                                fontSize={{ base: "sm", md: "md" }}
                                color={
                                  theme === "light"
                                    ? "secondary.MineShaft"
                                    : "dark.White"
                                }
                              >
                                {line}
                              </Text>
                            </li>
                          ))}
                        </OrderedList>
                      ) : (
                        <UnorderedList key={idx}>
                          {block.items.map((line, i) => (
                            <li key={i}>
                              <Text
                                as="span"
                                fontSize={{ base: "sm", md: "md" }}
                                color={
                                  theme === "light"
                                    ? "secondary.MineShaft"
                                    : "dark.White"
                                }
                              >
                                {line}
                              </Text>
                            </li>
                          ))}
                        </UnorderedList>
                      );
                    }
                    return null;
                  })}
                </FaqBody>
              )}
            </FaqRow>
          );
        })}
      </FaqStack>
    </MainContainer>
  );
};

export default UserGuide;

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 70vh;
`;

const SearchWrapper = styled(Flex).attrs({ align: "stretch" })`
  width: 100%;
  max-width: 820px;
  margin: 0 auto 2.5rem auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const SearchButton = styled(Button)`
  border-radius: 0 8px 8px 0;
`;

const FaqStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
`;

const FaqRow = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#1c1c1c")};
  box-shadow: ${({ mode }) =>
    mode === "light"
      ? "0px 1px 2px 0px rgba(0, 0, 0, 0.06)"
      : "0px 1px 3px 0px rgba(0, 0, 0, 0.1)"};
`;

const FaqHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ mode, isOpen }) =>
      isOpen
        ? "rgba(201, 206, 252, 0.18)"
        : mode === "light"
        ? "rgba(201, 206, 252, 0.10)"
        : "rgba(255,255,255,0.04)"};
  }
`;

const FaqBody = styled.div`
  padding: 16px 20px 20px 20px;
  background: ${({ mode }) =>
    mode === "light"
      ? "rgba(201, 206, 252, 0.18)"
      : "rgba(145, 125, 236, 0.10)"};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OrderedList = styled.ol`
  margin: 0;
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const UnorderedList = styled.ul`
  margin: 0;
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: ${({ mode }) => (mode === "light" ? "#828282" : "#D0D0D0")};
  font-size: 0.95rem;
`;
