import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Select,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

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
  disabled = false,
  mode,
  ...props
}) => {
  validator["pattern"] = {
    value: /[A-Za-z0-9_+]/g,
    message: "Masukkan harus berupa string",
  };
  return (
    <FormControl {...props} isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        bg={
          errors[name]
            ? "state.ErrorGhost"
            : mode === "light"
            ? "secondary.InputGray"
            : "dark.LightBlack"
        }
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, validator)}
      />
      <FormErrorMessage>
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
  validator,
  placeholder,
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
        placeholder={placeholder}
        bg={errors[name] ? "state.ErrorGhost" : "secondary.InputGray"}
        id={name}
        {...register(name, validator)}
      />
      <FormErrorMessage>
        {errors[name] && (
          <span>
            <Warning /> {errors[name].message}
          </span>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};

export const InputPassword = ({
  register,
  errors,
  name,
  label,
  validator,
  placeholder,
  mode,
  ...props
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl {...props} isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          id={name}
          pr="4.5rem"
          bg={
            errors[name]
              ? "state.ErrorGhost"
              : mode === "light"
              ? "secondary.InputGray"
              : "dark.LightBlack"
          }
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register(name, validator)}
        />
        <InputRightElement mr={3}>
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            <Icon h={4} w={4} as={show ? BsFillEyeSlashFill : BsFillEyeFill} />
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>
        {errors[name] && (
          <span>
            <Warning /> {errors[name].message}
          </span>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};

export const InputSelect = ({
  register,
  errors,
  name,
  label,
  placeholder,
  validator,
  children,
  disabled,
  ...props
}) => (
  <FormControl {...props} isInvalid={errors[name]}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    <Select
      bg={errors[name] ? "state.ErrorGhost" : "secondary.InputGray"}
      variant="filled"
      _focus={{
        borderColor: "primary.Purple",
        backgroundColor: "primary.White",
      }}
      id={name}
      placeholder={placeholder ? placeholder : ""}
      disabled={disabled}
      {...register(name, validator)}
    >
      {children}
    </Select>
    <FormErrorMessage fontWeight="semibold">
      {errors[name] && (
        <span>
          <Warning /> {errors[name].message}
        </span>
      )}
    </FormErrorMessage>
  </FormControl>
);
