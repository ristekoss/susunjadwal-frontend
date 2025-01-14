import React, { useEffect } from "react";
import ReactGA from "react-ga";
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
} from "@chakra-ui/react";

import { postScrapeSchedule } from "services/api";

import { InfoToast, SuccessToast, ErrorToast } from "components/Toast";
import { InputPassword, InputText } from "components/Forms";
import { Bauhaus } from "components/Bauhaus";

import Alert from "./Alert";
import Info from "./Info";
import { useState } from "react";

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

  const onSubmit = async (values) => {
    // try {
    //   InfoToast("Sedang memperbaharui jadwal", isMobile, theme);
    //   await postScrapeSchedule(values);
    //   setTimeout(() => {
    //     toast.closeAll();
    //     ReactGA.event({
    //       category: "Update Matkul",
    //       action: "Updated the courses",
    //     });
    //     SuccessToast("Jadwal berhasil diperbaharui", isMobile, theme);
    //     window.location.replace("/susun");
    //   }, 1000);
    // } catch (e) {
    //   setTimeout(() => {
    //     toast.closeAll();
    //     ErrorToast(e.response.data.message, isMobile, theme);
    //   }, 1000);
    // }
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
          <Alert />
          <Button
            disabled={!username || !password}
            mt={8}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            w={{ sm: "100%", lg: "unset" }}
            bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
            color={theme === "light" ? "white" : "dark.White"}
            onClick={() => useMixpanel.track("update_matkul")}
          >
            Update Jadwal
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
