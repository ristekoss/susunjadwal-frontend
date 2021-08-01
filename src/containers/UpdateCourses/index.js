import React from "react";
import ReactGA from "react-ga";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Text,
  useToast
} from "@chakra-ui/react";

import { postScrapeSchedule } from "services/api";

import { InputPassword, InputText } from "components/Forms";
import { InfoToast, SuccessToast, ErrorToast } from "components/Toast";
import { Bauhaus } from "components/Bauhaus";
import Alert from "./Alert";
import Info from "./Info";

const UpdateCourses = () => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      InfoToast(
        "Sedang memperbaharui jadwal",
        isMobile
      );
      await postScrapeSchedule(values);
      setTimeout(() => {
        toast.closeAll();
        ReactGA.event({
          category: "Update Matkul",
          action: "Updated the courses"
        });
        SuccessToast(
          "Jadwal berhasil diperbaharui",
          isMobile
        );
        window.location.replace("/susun")
      }, 1000);
    } catch (e) {
      setTimeout(() => {
        toast.closeAll();
        ErrorToast(
          e.response.data.message,
          isMobile
        );
      }, 1000)
    }
  }

  return (
    <>
      {!isMobile && <Bauhaus isPrivate />}
      <Box
        width={{lg: "80%", xl: "70%"}}
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          mt={isMobile 
            ? "-3"
            : "4"
          }
          mb={{ base: "24px", lg: "48px" }}
          textAlign={isMobile
            ? "center"
            : "left"
          }
        >
          Daftarkan SSO untuk Update Matkul
        </Text>
        <Info />
        <FormContainer className="form-container" onSubmit={handleSubmit(onSubmit)} >
          <InputText
            label="Username SSO"
            name="username"
            marginTop="1rem"
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
            register={register}
            validator={{
              required: `Password tidak boleh kosong`,
            }}
            errors={errors}
          />
          <Alert />
          <Button
            mt={8}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            w={{sm: "100%", lg: "unset"}}
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