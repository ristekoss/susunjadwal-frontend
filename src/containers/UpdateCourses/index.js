import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Text,
  useToast
} from "@chakra-ui/react";

import { postScrapSchedule } from "services/api";

import { InputPassword, InputText } from "components/Forms";
import { InfoToast, SuccessToast } from "components/Toast";
import { Bauhaus } from "components/Bauhaus";
import Alert from "./Alert";
import Info from "./Info";

const UpdateCourses = ({ history }) => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      InfoToast(
        "Sedang memperbaharui jadwal",
        isMobile
      );
      postScrapSchedule(values);
      setTimeout(() => {
        toast.closeAll();
        SuccessToast(
          "Jadwal berhasil diperbaharui",
          isMobile
        );
        // history.push("/susun")
        window.location.replace("/susun")
      }, 1000);
    } catch (err) {
      InfoToast(
        "Maaf ada sedikit kendala, silahkan coba beberapa saat lagi",
        isMobile
      );
      throw err;
    }
  }

  return (
    <>
      <Bauhaus />
      <Box
        width={{lg: "80%", xl: "70%"}}
        mt={{ base: "0px", lg: "-40px" }}
      >
        <Link to="/">
          <Text
            color="var(--chakra-colors-primary-Purple)"
            fontSize="lg"
            ml="-9px"
          >
              <ChevronLeftIcon w={8} h={8} />
              Kembali ke Halaman Utama
          </Text>
        </Link>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          mt="4"
          mb={{ base: "24px", lg: "48px" }}
          textAlign={{sm: "center", lg: "left"}}
        >
          Daftarkan SSO untuk Update Jadwal
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
            disabled={isSubmitSuccessful}
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

const FormContainer = styled.div`
  margin-top: 3rem;
`;