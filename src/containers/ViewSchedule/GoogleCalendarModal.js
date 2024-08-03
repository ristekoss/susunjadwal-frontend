import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Image,
  IconButton,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon, MinusIcon } from "@chakra-ui/icons";
import styled from "styled-components";
import GoogleCalendarImg from "assets/GoogleCalendar.png";
import bauhaus from "assets/Feedback/Modal/bauhaus-feedback-1.png";
import MulaiImage from "assets/GoogleCalendarModal/mulai.png";
import Step1Image from "assets/GoogleCalendarModal/step1.png";
import Step2Image from "assets/GoogleCalendarModal/step2.png";
import Step3Image from "assets/GoogleCalendarModal/step3.png";
import Step4Image from "assets/GoogleCalendarModal/step4.png";
import Step5Image from "assets/GoogleCalendarModal/step5.png";
import Step6Image from "assets/GoogleCalendarModal/step6.png";
import Step7Image from "assets/GoogleCalendarModal/step7.png";
import Step8Image from "assets/GoogleCalendarModal/step8.png";
import ProgressBar from "./ProgressBar";

const steps = [
  {
    image: Step1Image,
    title: "Step ke-1",
    description: "Klik tombol 'Ekspor ke .ics' (letak button ada di sebelah button download)."
  },
  {
    image: Step2Image,
    title: "Step ke-2",
    description: "File jadwal akademik bertipe .ics akan mulai didownload."
  },
  {
    image: Step3Image,
    title: "Step ke-3",
    description: "Kunjungi Google Calendar pada Desktop dengan akun Google kalian."
  },
  {
    image: Step4Image,
    title: "Step ke-4",
    description: "Klik tombol Settings seperti di gambar."
  },
  {
    image: Step5Image,
    title: "Step ke-5",
    description: "Klik section 'Import & Export'."
  },
  {
    image: Step6Image,
    title: "Step ke-6",
    description: "Pada bagian 'Import', klik 'Select file from your computer' dan pilih file jadwal akademik yang telah diunduh."
  },
  {
    image: Step7Image,
    title: "Step ke-7",
    description: "Lalu, klik tombol 'Import'."
  },
  {
    image: Step8Image,
    title: "Selesai!",
    description: "Jadwal akademik sudah berhasil dipindahkan ke Google Calendar!"
  }
];

const GoogleCalendarModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [step, setStep] = useState(0);
  const theme = useColorModeValue("light", "dark");

  const handleCloseWidget = (e) => {
    e.stopPropagation();
    setIsWidgetVisible(false);
  };

  const handleMinimizeModal = () => {
    onClose();
    setIsWidgetVisible(true);
  };

  const handleCloseModal = () => {
    setIsClosed(true);
    onClose();
    setIsWidgetVisible(false);
  };

  const handleOpenModal = () => {
    setIsClosed(false);
    onOpen();
    setIsWidgetVisible(false);
  };

  const handleNextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, steps.length));
  };

  const handlePrevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <>
      {!isClosed && isWidgetVisible && (
        <GoogleCalendarWidget onClick={handleOpenModal} bg={theme === "dark" ? "primary.LightPurple" : "primary.Purple"} hoverBg={theme === "dark" ? "#402D99" : "#674de0"}>
          <LabelBaru>Baru!</LabelBaru>
          <TextContainer>
            <WidgetText>
              Integrasikan <Text as="span" color="secondary.Golden">Jadwalmu</Text>
              <br />
              dengan <Text as="span" color="secondary.Golden">Google Calendar</Text>
            </WidgetText>
          </TextContainer>
          <Image
            src={GoogleCalendarImg}
            boxSize="40px"
            marginLeft={"4px"}
            alt="Google Calendar"
          />
          <CloseButton onClick={handleCloseWidget} bg={"#e2e8f0"} color={theme === "dark" ? "#1A202C" : "#333"}>
            <span>✕</span>
          </CloseButton>
        </GoogleCalendarWidget>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered autoFocus={false}>
        <ModalOverlay />
        <StyledModalContent theme={theme}>
          <Box position="absolute" top="0" left="0" width={{ base: "36px", md: "40px" }}>
            <Image src={bauhaus} alt="Bauhaus" />
          </Box>
          <HeaderContent position="absolute" top="0" right="0">
            <IconButton
              icon={<MinusIcon />}
              size="lg"
              variant="ghost"
              onClick={handleMinimizeModal}
              marginRight="2"
              tabIndex={-1}
              color={theme === "dark" ? "white" : "primary.Purple"}
            />
            <IconButton
              icon={<CloseIcon />}
              size="lg"
              variant="ghost"
              onClick={handleCloseModal}
              tabIndex={-1}
              color={theme === "dark" ? "white" : "primary.Purple"}
            />
          </HeaderContent>
          <ModalBody>
            {step === 0 ? (
              <ModalBodyContent>
                <Text fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} fontWeight="bold" textAlign="center" color={theme === "dark" ? "white" : "black"} marginTop={{ base: "20px", md: "0px" }}>
                  Integrasikan <Text as="span" color={theme === 'dark' ? "primary.LightPurple" : "primary.Purple"}>Jadwalmu</Text> dengan Google Calendar
                </Text>
                <ImageContainer padding={"30px"}>
                  <StyledImage src={MulaiImage} alt="Mulai" />
                </ImageContainer>
              </ModalBodyContent>
            ) : (
              <ModalBodyContent>
                <Text fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} fontWeight="bold" textAlign="center" color={theme === "dark" ? "white" : "black"} marginTop={{ base: "20px", md: "0px" }}>
                  Integrasikan <Text as="span" color={theme === 'dark' ? "primary.LightPurple" : "primary.Purple"}>Jadwalmu</Text> dengan Google Calendar
                </Text>
                <ImageContainer padding={step <= 3 ? "30px" : step >= 4 ? "30px 30px 0 30px" : "0"}>
                  <StyledImage src={steps[step - 1].image} alt={`Step ${step}`} size={step === steps.length ? "70%" : "100%"} />
                </ImageContainer>
                <ProgressBar steps={steps.map(step => step.title)} currentStep={step} />
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" marginTop="4" textAlign='left' color={theme === "dark" ? "white" : "black"}>
                  {steps[step - 1].title}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} textAlign='left' fontWeight='semibold' color={theme === "dark" ? "white" : "black"}>
                  {steps[step - 1].description}
                </Text>
              </ModalBodyContent>
            )}
          </ModalBody>
          <ModalFooter>
            {step === 0 ? (
              <Button colorScheme="purple" width="100%" padding={{ base: "12px", md: "24px" }} borderRadius="12px" fontSize={{ base: "sm", md: "lg" }} onClick={handleNextStep}>
                Mulai
              </Button>
            ) : step === steps.length ? (
              <Button colorScheme="purple" width="100%" padding={{ base: "12px", md: "24px" }} borderRadius="12px" fontSize={{ base: "sm", md: "lg" }} onClick={handleCloseModal}>
                Selesai
              </Button>
            ) : (
              <Box width="100%" display="flex" justifyContent="space-between" gap={2}>
                <Button bgColor='#C9CEFC' color='primary.LightPurple' _hover={{ bgColor: '#E1E5FE' }} width='full' padding={{ base: "12px", md: "24px" }} borderRadius="8px" fontSize={{ base: "sm", md: "lg" }} onClick={handlePrevStep} isDisabled={step === 1}>
                  Sebelumnya
                </Button>
                <Button colorScheme="purple" width='full' padding={{ base: "12px", md: "24px" }} borderRadius="8px" fontSize={{ base: "sm", md: "lg" }} onClick={handleNextStep}>
                  Selanjutnya
                </Button>
              </Box>
            )}
          </ModalFooter>
        </StyledModalContent>
      </Modal>
    </>
  );
};

export default GoogleCalendarModal;

const GoogleCalendarWidget = styled(Box)`
  z-index: 1000;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${props => props.bg};
  color: white;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${props => props.hoverBg};
  }
`;

const LabelBaru = styled(Box)`
  position: absolute;
  top: -15px;
  left: 0px;
  background-color: #FFD668;
  color: #000;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
`;

const TextContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
`;

const WidgetText = styled(Text)`
  color: white;
`;

const CloseButton = styled(Box)`
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: ${props => props.bg};
  color: ${props => props.color};
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ImageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: #CEFAFF;
  height: auto;
  border-radius: 12px;
  overflow: hidden;
  padding: ${props => props.padding || "30px"};

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StyledImage = styled(Image)`
  width: ${props => props.size};
  height: ${props => props.height || "auto"};
  object-fit: cover;
  @media (max-width: 768px) {
    scale: 1.2;
    padding: 8px;
  }
`;

const StyledModalContent = styled(ModalContent)`
  width: 100%;
  max-width: 570px;
  border-radius: 24px;
  padding: 24px;
  padding-top: 48px;
  margin: 0 32px 0 32px;
  position: relative;
  overflow: hidden;
  background: ${props => (props.theme === "dark" ? "#18181B" : "white")};
  color: ${props => (props.theme === "dark" ? "white" : "black")};

  @media (max-width: 768px) {
    padding: 0px;
    padding-top: 32px;
    max-width: 420px;
  }
`;

const ModalBodyContent = styled(Box)`
  text-align: center;
  margin-top: 20px;
`;

const HeaderContent = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  margin-top: 1rem;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;
