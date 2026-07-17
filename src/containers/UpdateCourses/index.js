import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useMixpanel } from "hooks/useMixpanel";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Text,
  useToast,
  useColorModeValue,
  VStack,
  Alert,
  AlertIcon,
  Progress,
} from "@chakra-ui/react";

import { InputPassword, InputText } from "components/Forms";
import { Bauhaus } from "components/Bauhaus";

import AlertComponent from "./Alert";
import Info from "./Info";
import { useState, useRef } from "react";
import { postScrapeScheduleSSE } from "services/api";

const UpdateCourses = () => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const toast = useToast();
  const theme = useColorModeValue("light", "dark");
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(""); // 'idle', 'updating', 'success', 'error'
  const logsEndRef = useRef(null);

  const username = watch("username");
  const password = watch("password");

  useEffect(() => {
    useMixpanel.track("open_update_matkul");
  }, []);

  useEffect(() => {
    if (username && !isUsernameChanged) {
      useMixpanel.track("update_matkul_fill_username");
      setIsUsernameChanged(true);
    }
  }, [username, isUsernameChanged]);

  useEffect(() => {
    if (password && !isPasswordChanged) {
      useMixpanel.track("update_matkul_fill_password");
      setIsPasswordChanged(true);
    }
  }, [password, isPasswordChanged]);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const onSubmit = async (values) => {
    setIsUpdating(true);
    setLogs([]);
    setUpdateProgress(0);
    setUpdateStatus("updating");
    let streamDidError = false;

    try {
      // Use the API helper for SSE
      const response = await postScrapeScheduleSSE({
        username: values.username,
        password: values.password,
      });

      if (
        !response ||
        typeof response !== "object" ||
        typeof response.ok === "undefined"
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        );
      }

      if (!response.ok) {
        const errorText = response.text ? await response.text() : "";
        throw new Error(
          `Server error (${response.status}): ${
            errorText || response.statusText
          }`,
        );
      }

      if (!response.body || !response.body.getReader) {
        throw new Error("Response body tidak valid.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Process complete lines, keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: log")) {
            continue; // Skip event type line
          }

          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              const newLog = {
                id: Date.now() + Math.random(),
                type: data.type || "info",
                message: data.message || line,
                timestamp: new Date().toLocaleTimeString(),
              };

              setLogs((prevLogs) => [...prevLogs, newLog]);

              if (data.type === "error") {
                streamDidError = true; // Set the flag
                setUpdateStatus("error");
              }

              // Update progress based on log content
              if (data.message) {
                const message = data.message.toLowerCase();
                if (message.includes("authenticating")) {
                  setUpdateProgress(10);
                } else if (message.includes("changing user role")) {
                  setUpdateProgress(20);
                } else if (message.includes("login successful")) {
                  setUpdateProgress(30);
                } else if (message.includes("accessing schedule")) {
                  setUpdateProgress(50);
                } else if (message.includes("found latest available period")) {
                  setUpdateProgress(60);
                } else if (message.includes("saving courses")) {
                  setUpdateProgress(80);
                } else if (message.includes("successfully saved")) {
                  setUpdateProgress(100);
                  setUpdateStatus("success");
                } else if (data.type === "error") {
                  setUpdateStatus("error");
                }
              }
            } catch (e) {
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  id: Date.now() + Math.random(),
                  type: "error",
                  message: `Error parsing data: ${line}`,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
          }
        }
      }

      if (streamDidError) {
        throw new Error(
          "Proses pembaruan gagal. Silakan periksa kembali kredensial Anda dan coba lagi.",
        );
      }

      // If we reach here, the stream completed successfully
      if (updateStatus !== "success" && updateStatus !== "error") {
        setUpdateStatus("success");
        setUpdateProgress(100);

        setLogs((prevLogs) => [
          ...prevLogs,
          {
            id: Date.now(),
            type: "success",
            message: "Stream completed successfully",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

      toast({
        title: "Success",
        description: "Jadwal berhasil diperbaharui",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Track successful update
      useMixpanel.track("update_matkul_success");

      setTimeout(() => {
        window.location.replace("/susun");
      }, 2000);
    } catch (error) {
      console.error("Error updating schedule:", error);
      setUpdateStatus("error");
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          id: Date.now(),
          type: "error",
          message: `Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      toast({
        title: "Error",
        description:
          error.message || "Terjadi kesalahan saat memperbarui jadwal",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      useMixpanel.track("update_matkul_error", { error: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {!isMobile && <Bauhaus isPrivate mode={theme} />}
      <Helmet title="Update Matkul" />

      <Box width={{ lg: "80%", xl: "70%" }}>
        <Text
          color={theme === "light" ? "primary.Purple" : "dark.White"}
          fontSize={{ base: "27.2px", lg: "3xl" }}
          fontWeight="bold"
          mt={{ base: "-40px", lg: "0px" }}
          mb={{ base: "24px", lg: "32px" }}
          textAlign={isMobile ? "center" : "left"}
        >
          Daftarkan SSO untuk Update Matkul
        </Text>
        <Info mode={theme} />
        <FormContainer
          className="form-container"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputText
            label="Username SSO"
            name="username"
            marginTop="1rem"
            mode={theme}
            register={register}
            validator={{
              required: `User name tidak boleh kosong`,
            }}
            errors={errors}
          />

          <InputPassword
            label="Password SSO"
            name="password"
            marginTop="1rem"
            mode={theme}
            register={register}
            validator={{
              required: `Password tidak boleh kosong`,
            }}
            errors={errors}
          />
          <AlertComponent />

          {/* Progress and logs section */}
          {isUpdating && (
            <Box
              mt={6}
              p={4}
              borderRadius="md"
              bg={theme === "light" ? "gray.50" : "gray.700"}
            >
              <Text
                mb={2}
                fontWeight="semibold"
                color={theme === "light" ? "gray.700" : "gray.200"}
              >
                Memperbarui Jadwal... ({updateProgress}%)
              </Text>
              <Progress
                value={updateProgress}
                colorScheme="purple"
                mb={4}
                hasStripe
                isAnimated
                size="lg"
              />

              <LogContainer
                theme={theme}
                maxH="250px"
                overflowY="auto"
                p={3}
                bg={theme === "light" ? "white" : "gray.800"}
                borderRadius="md"
                border="1px solid"
                borderColor={theme === "light" ? "gray.200" : "gray.600"}
              >
                <VStack spacing={2} align="stretch">
                  {logs.map((log) => (
                    <Alert
                      key={log.id}
                      status={
                        log.type === "error"
                          ? "error"
                          : log.type === "warning"
                          ? "warning"
                          : log.type === "success"
                          ? "success"
                          : "info"
                      }
                      size="sm"
                      borderRadius="md"
                    >
                      <AlertIcon />
                      <Box flex="1">
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {log.timestamp}
                        </Text>
                        <Text fontSize="sm">{log.message}</Text>
                      </Box>
                    </Alert>
                  ))}
                  {logs.length === 0 && (
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      textAlign="center"
                      py={4}
                    >
                      Menunggu log...
                    </Text>
                  )}
                  <div ref={logsEndRef} />
                </VStack>
              </LogContainer>
            </Box>
          )}

          {/* Success message */}
          {updateStatus === "success" && !isUpdating && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Berhasil!</Text>
                <Text fontSize="sm">
                  Jadwal berhasil diperbaharui. Anda akan dialihkan ke halaman
                  susun jadwal.
                </Text>
              </Box>
            </Alert>
          )}

          <Button
            disabled={isUpdating}
            mt={8}
            colorScheme="teal"
            isLoading={isUpdating}
            loadingText="Memperbarui..."
            type="submit"
            w={{ sm: "100%", lg: "unset" }}
            bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
            color={theme === "light" ? "white" : "dark.White"}
            onClick={() => useMixpanel.track("update_matkul")}
          >
            {isUpdating ? "Memperbarui Jadwal..." : "Update Jadwal"}
          </Button>
        </FormContainer>
      </Box>
    </>
  );
};

export default UpdateCourses;

const FormContainer = styled.form`
  margin-top: 3rem;
`;

const LogContainer = styled(Box)`
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => (props.theme === "light" ? "#f1f1f1" : "#2d3748")};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.theme === "light" ? "#cbd5e0" : "#4a5568")};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => (props.theme === "light" ? "#a0aec0" : "#718096")};
  }

  /* Smooth scrolling */
  scroll-behavior: smooth;
`;
