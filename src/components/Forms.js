import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const Warning = () => {
  return (
    <WarningIcon transform="auto" rotate="180deg" w={4} color="state.Error" />
  );
};

export const InputText = ({
  register,
  errors,
  name,
  label,
  placeholder,
  validator,
  ...props
}) => {
  return (
    <FormControl {...props} isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        bg={errors[name] ? "state.ErrorGhost" : "secondary.InputGray"}
        variant="filled"
        _focus={{
          borderColor: "primary.Purple",
          backgroundColor: "primary.White",
        }}
        id={name}
        placeholder={placeholder ? placeholder : ""}
        {...register(name, validator)}
      />
      <FormErrorMessage fontWeight="semibold">
        {errors[name] && (
          <span>
            <Warning /> {errors[name].message}
          </span>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};
export const InputEmail = ({
  register,
  errors,
  name,
  label,
  placeholder,
  validator,
  ...props
}) => {
  validator["pattern"] = {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Email yang anda masukkan tidak valid",
  };

  return (
    <FormControl {...props} isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        bg={errors[name] ? "state.ErrorGhost" : "secondary.InputGray"}
        variant="filled"
        _focus={{
          borderColor: "primary.Purple",
          backgroundColor: "primary.White",
        }}
        id={name}
        placeholder={placeholder ? placeholder : ""}
        {...register(name, validator)}
      />
      <FormErrorMessage fontWeight="semibold">
        {errors[name] && (
          <span>
            <Warning /> {errors[name].message}
          </span>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};
// export const InputSelection = () => {};
