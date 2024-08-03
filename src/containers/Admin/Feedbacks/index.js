import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import { dummyFeedbacks, feedbackStats } from './feedback';

const AdminFeedbacks = () => {
  const [feedbacksPerPage, setFeedbacksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const totalPages = Math.ceil(dummyFeedbacks.length / feedbacksPerPage);
  const sortedFeedbacks = [...dummyFeedbacks];

  const sortedData = () => {
    if (sortConfig.key !== null) {
      sortedFeedbacks.sort((a, b) => {
        if (sortConfig.key === 'Waktu') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortedFeedbacks;
  };

  const currentFeedbacks = sortedData().slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const averageRating = (
    dummyFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / dummyFeedbacks.length
  ).toFixed(1);

  const getPaginationItems = () => {
    const items = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      items.push(
        <PaginationButton key={1} onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
          1
        </PaginationButton>
      );
      if (startPage > 2) {
        items.push(<PaginationButton key="ellipsis-start" disabled>...</PaginationButton>);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationButton key={page} onClick={() => handlePageChange(page)} isActive={currentPage === page}>
          {page}
        </PaginationButton>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationButton key="ellipsis-end" disabled>...</PaginationButton>);
      }
      items.push(
        <PaginationButton key={totalPages} onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
          {totalPages}
        </PaginationButton>
      );
    }

    return items;
  };

  const renderSortIcon = key => {
    if (sortConfig.key !== key) return <ArrowUpIcon opacity={0.5} ml={2} />;
    return sortConfig.direction === 'asc' ? <ArrowUpIcon ml={2} /> : <ArrowDownIcon ml={2} />;
  };

  const tableBg = useColorModeValue('primary.White', 'dark.LightBlack');
  const tableTextColor = useColorModeValue('secondary.MineShaft', 'dark.White');
  const selectBg = useColorModeValue('primary.White', 'dark.LightBlack');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh">
      <Helmet title="Feedback Recap"/>
      <Box p={8} mx={{ xl: 20 }}>
        <Text fontSize={{ base: '2xl', md: '5xl' }} fontWeight="bold" textAlign="center" mb={6} color="primary.Purple">
          Rating & Ulasan User
        </Text>

        <Flex alignItems="center" mb={6}>
          <Flex direction="column" alignItems="center" mr={8}>
            <Text fontSize="5xl" textAlign={'center'} fontWeight="bold" mr={4} color="primary.Purple">
              {averageRating}
            </Text>
            <HStack spacing={1}>
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < Math.floor(averageRating) ? 'yellow.400' : 'gray.300'}
                    boxSize={{ base: 3, md: 6 }}
                    padding={{ base: 0, md: 1 }}
                  />
                ))}
            </HStack>
            <Text fontSize={{ md: '2xl' }} fontWeight="bold">
              {dummyFeedbacks.length} ulasan
            </Text>
          </Flex>
          <Flex direction="column" flex={1}>
            {feedbackStats.map((stat, i) => (
              <Flex alignItems="center" key={i}>
                <Text w={4} fontWeight="bold">
                  {stat.rating}
                </Text>
                <Box flex={1} h={3} bg="gray.200" mx={2} borderRadius="full">
                  <Box h={3} bg="primary.Purple" width={`${(stat.count / dummyFeedbacks.length) * 100}%`} borderRadius="full"></Box>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Box overflowX="auto" my={10} border="1px" borderColor={borderColor} borderRadius="lg" fontSize={{ base: 'sm', md: 'lg' }} width="100%" bg={tableBg} color={tableTextColor}>
          <Table variant="simple" minWidth="800px">
            <Thead bg="primary.Purple" borderRadius="lg">
              <Tr>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                  <Flex alignItems="center" onClick={() => handleSort('id')}>
                    No {renderSortIcon('id')}
                  </Flex>
                </Th>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                  <Flex alignItems="center" onClick={() => handleSort('username')}>
                    Nama User {renderSortIcon('username')}
                  </Flex>
                </Th>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                  <Flex alignItems="center" onClick={() => handleSort('rating')}>
                    Rating {renderSortIcon('rating')}
                  </Flex>
                </Th>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                    Feedback (opsional)
                </Th>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                  <Flex alignItems="center" onClick={() => handleSort('time')}>
                    Waktu {renderSortIcon('time')}
                  </Flex>
                </Th>
                <Th color="white" textTransform="none" fontSize={{ base: 'sm', md: 'lg' }} p={{ base: 4, md: 6 }} fontWeight="medium">
                  <Flex alignItems="center" onClick={() => handleSort('status')}>
                    Aksi {renderSortIcon('status')}
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentFeedbacks.map((feedback, index) => (
                <Tr key={feedback.id}>
                  <Td>{(currentPage - 1) * feedbacksPerPage + index + 1}</Td>
                  <Td width='200px'>{feedback.username}</Td>
                  <Td>{feedback.rating}</Td>
                  <Td>{feedback.feedback}</Td>
                  <Td width='250px'>{feedback.time}</Td>
                  <Td>
                    <Select defaultValue={feedback.status} width="175px" bg={selectBg}>
                      <option value="diproses">Diproses</option>
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
          <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeftIcon boxSize={10}/>
            <Box display={{ base: 'none', lg: 'inline' }}>Previous</Box>
          </PaginationButton>
          {getPaginationItems()}
          <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <Box display={{ base: 'none', lg: 'inline' }}>Next</Box>
            <ChevronRightIcon boxSize={10}/>
          </PaginationButton>
        </Flex>

        <Flex justifyContent={{ base: 'center', lg: 'right' }} alignItems="center" mt={{ base: 10, lg: -12 }}>
          <Text>Ulasan per halaman:</Text>
          <Select
            width="75px"
            value={feedbacksPerPage}
            onChange={e => setFeedbacksPerPage(parseInt(e.target.value, 10))}
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

const PaginationButton = styled.button`
  background: transparent;
  color: var(--chakra-colors-primary-Purple);
  border: ${props => (props.isActive ? '1px solid var(--chakra-colors-primary-Purple)' : 'none')};
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
