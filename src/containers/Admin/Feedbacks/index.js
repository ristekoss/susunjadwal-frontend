import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  HStack,
  useColorModeValue,
  Image,
  Link,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setLoading } from "redux/modules/appState";
import {
  getReviews,
  getReviewOverview,
  updateReviewStatus,
} from "services/api";
import LogoSunjad from "assets/Beta/LogoSunjad-light.svg";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksPerPage, setFeedbacksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        history.push("/admin");
        return;
      }

      dispatch(setLoading(true));
      try {
        const reviewResponse = await getReviews(
          token,
          currentPage,
          feedbacksPerPage,
        );
        setFeedbacks(reviewResponse.data.reviews);
        setTotalPages(reviewResponse.data.total_page);

        const overviewResponse = await getReviewOverview(token);
        setAverageRating(overviewResponse.data.average_rating);
        setRatingCounts(overviewResponse.data.rating_counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => dispatch(setLoading(false)), 500);
      }
    };

    fetchData();
  }, [currentPage, feedbacksPerPage, dispatch, history]);

  const handleStatusChange = async (reviewId, status) => {
    const token = localStorage.getItem("admin_token");
    try {
      await updateReviewStatus(token, reviewId, status);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === reviewId
            ? { ...feedback, reviewed: status }
            : feedback,
        ),
      );
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPaginationItems = () => {
    const items = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      items.push(
        <PaginationButton
          key={1}
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationButton>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationButton key="ellipsis-start" disabled>
            ...
          </PaginationButton>,
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationButton
          key={page}
          onClick={() => handlePageChange(page)}
          isActive={currentPage === page}
        >
          {page}
        </PaginationButton>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationButton key="ellipsis-end" disabled>
            ...
          </PaginationButton>,
        );
      }
      items.push(
        <PaginationButton
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationButton>,
      );
    }

    return items;
  };

  const tableBg = useColorModeValue("primary.White", "dark.LightBlack");
  const tableTextColor = useColorModeValue("secondary.MineShaft", "dark.White");
  const selectBg = useColorModeValue("primary.White", "dark.LightBlack");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    history.push("/admin");
  };

  return (
    <Box minH="100vh">
      <Helmet title="Feedback Recap" />
      <Container>
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Link href="/">
            <Image
              src={LogoSunjad}
              alt="logo"
              objectFit="contain"
              w={{ base: "140px", lg: "initial" }}
            />
          </Link>
          <SignOutLink as="button" onClick={handleSignOut}>
            Sign Out
          </SignOutLink>
        </Flex>
      </Container>

      <Box p={8} mx={{ xl: 20 }}>
        <Text
          fontSize={{ base: "2xl", md: "5xl" }}
          fontWeight="bold"
          textAlign="center"
          mb={6}
          color="primary.Purple"
        >
          Rating & Ulasan User
        </Text>

        <Flex alignItems="center" mb={6}>
          <Flex direction="column" alignItems="center" mr={8}>
            <Text
              fontSize="5xl"
              textAlign={"center"}
              fontWeight="bold"
              mr={4}
              color="primary.Purple"
            >
              {averageRating.toFixed(1)}
            </Text>
            <HStack spacing={1}>
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={
                      i < Math.floor(averageRating) ? "yellow.400" : "gray.300"
                    }
                    boxSize={{ base: 3, md: 6 }}
                    padding={{ base: 0, md: 1 }}
                  />
                ))}
            </HStack>
            <Text fontSize={{ md: "2xl" }} fontWeight="bold">
              {Object.values(ratingCounts).reduce((a, b) => a + b, 0)} ulasan
            </Text>
          </Flex>
          <Flex direction="column" flex={1}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Flex alignItems="center" key={rating}>
                <Text w={4} fontWeight="bold">
                  {rating}
                </Text>
                <Box flex={1} h={3} bg="gray.200" mx={2} borderRadius="full">
                  <Box
                    h={3}
                    bg="primary.Purple"
                    width={`${
                      (ratingCounts[rating] /
                        Object.values(ratingCounts).reduce(
                          (a, b) => a + b,
                          0,
                        )) *
                      100
                    }%`}
                    borderRadius="full"
                  ></Box>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Box
          overflowX="auto"
          my={10}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          fontSize={{ base: "sm", md: "lg" }}
          width="100%"
          bg={tableBg}
          color={tableTextColor}
        >
          <Table variant="simple" minWidth="800px">
            <Thead bg="primary.Purple" borderRadius="lg">
              <Tr>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  No
                </Th>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  Nama User
                </Th>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  Rating
                </Th>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  Feedback (opsional)
                </Th>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  Waktu
                </Th>
                <Th
                  color="white"
                  textTransform="none"
                  fontSize={{ base: "sm", md: "lg" }}
                  p={{ base: 4, md: 6 }}
                  fontWeight="medium"
                >
                  Aksi
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {feedbacks.map((feedback, index) => (
                <Tr key={feedback.id}>
                  <Td>{(currentPage - 1) * feedbacksPerPage + index + 1}</Td>
                  <Td width="200px">{feedback.user_name}</Td>
                  <Td>{feedback.rating}</Td>
                  <Td>{feedback.comment}</Td>
                  <Td width="250px">
                    {new Date(feedback.created_at).toLocaleString()}
                  </Td>
                  <Td>
                    <Select
                      defaultValue={
                        feedback.reviewed ? "telah_diproses" : "belum_diproses"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          feedback.id,
                          e.target.value === "telah_diproses",
                        )
                      }
                      width="175px"
                      bg={selectBg}
                    >
                      <option value="belum_diproses">Belum diproses</option>
                      <option value="telah_diproses">Telah diproses</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Flex justifyContent="center" alignItems="center">
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon boxSize={10} />
            <Box display={{ base: "none", lg: "inline" }}>Previous</Box>
          </PaginationButton>
          {getPaginationItems()}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Box display={{ base: "none", lg: "inline" }}>Next</Box>
            <ChevronRightIcon boxSize={10} />
          </PaginationButton>
        </Flex>

        <Flex
          justifyContent={{ base: "center", lg: "right" }}
          alignItems="center"
          mt={{ base: 10, lg: -12 }}
        >
          <Text>Ulasan per halaman:</Text>
          <Select
            width="75px"
            value={feedbacksPerPage}
            onChange={(e) => setFeedbacksPerPage(parseInt(e.target.value))}
            ml={2}
            bg={selectBg}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </Select>
        </Flex>
      </Box>
    </Box>
  );
};

const Container = (props) => (
  <Box
    bg="primary.White"
    py={{ base: "14px", lg: "18px" }}
    px={{ base: "1.5rem", lg: "5rem" }}
    overflow="hidden"
    display="flex"
    alignItems="center"
    position="fixed"
    top="0"
    left="0"
    width="100%"
    boxShadow="0px 0px 5px 0px #00000026"
    zIndex="5"
    {...props}
  />
);

export const SignOutLink = styled.button`
  font-size: 18px;
  white-space: nowrap;
  color: var(--chakra-colors-state-Error) !important;
  @media only screen and (max-width: 900px) {
    font-size: 14px;
    line-height: 3rem;
  }
`;

const PaginationButton = styled.button`
  background: transparent;
  color: var(--chakra-colors-primary-Purple);
  border: ${(props) =>
    props.isActive ? "1px solid var(--chakra-colors-primary-Purple)" : "none"};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: var(--chakra-colors-primary-Purple);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default AdminFeedbacks;
