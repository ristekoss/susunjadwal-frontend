import React, { useEffect, useState } from 'react';
import { Box, Circle, Flex } from '@chakra-ui/react';

const ProgressBar = ({ steps, currentStep }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current !== currentStep) {
      const timeout = setTimeout(() => setCurrent(currentStep), 150);
      return () => clearTimeout(timeout);
    }
  }, [current, currentStep]);

  return (
    <Box w="full" my="32px">
      <Flex justify="space-between" align="center" position="relative" gap={{ base: 2, md: 4 }}>
        {steps.map((step, index) => (
          <Flex key={index} flex="1" flexDirection="column" align="center" position="relative">
            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
              <Circle
                size={{ base: "24px", sm:"28px",  md: "32px", lg: "40px"}}
                bg={index < current ? 'primary.Purple' : '#CEFAFF'}
                zIndex="10"
                transition="background-color 0.5s"
                fontWeight="semibold"
                color={index < current ? 'white' : 'black'}
              >
                {index + 1}
              </Circle>
              {index < steps.length - 1 && (
                <Box
                  position="absolute"
                  right={{ base: "-70%", md: "-90%" }}
                  top="50%"
                  transform="translateY(-50%)"
                  h="4px"
                  bg={index < current - 1 ? 'primary.Purple' : '#CEFAFF'}
                  w={{ base: "30px", md: "50px" }}
                  transition="background-color 0.5s"
                  zIndex="0"
                />
              )}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default ProgressBar;
