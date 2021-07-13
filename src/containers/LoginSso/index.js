import React from 'react';
import Bauhaus from 'components/Bauhaus';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import { InputPassword, InputText } from 'components/Forms';
import { useForm } from 'react-hook-form';

const LoginSso = ({ history }) => {

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch
  } = useForm();

  const onSubmit = () => {
    console.log("DATA KAMU SUDAH KAMI KIRIM")
  }

  return (
    <>
      <Bauhaus />
      <Box width={{lg: '80%', xl: '70%'}}>
        <Link to='/'>
          <Text 
            color="var(--chakra-colors-primary-Purple)" 
            fontSize="lg" 
            ml='-9px'
          >
              <ChevronLeftIcon w={8} h={8} />
              Kembali ke Halaman Utama
          </Text>
        </Link>
        <Text 
          fontSize="3xl" 
          fontWeight="bold" 
          mt="4" 
          textAlign={{sm: 'center', lg: 'left'}}
        >
          Daftarkan SSO untuk Update Jadwal
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText 
            label="User Name"
            name="username"
            marginTop="1rem"
            register={register}
            placeholder="john.doe"
            validator={{
              required: `User name tidak boleh kosong`,
            }}
            errors={errors}
          />

          <InputPassword
            label="Kata Sandi"
            name="password"
            marginTop="1rem"
            register={register}
            placeholder="password"
            validator={{
              required: `User name tidak boleh kosong`,
            }}
            errors={errors}
          />
        </form>
      </Box>
    </>
  );
};

export default LoginSso;