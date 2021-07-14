import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import Bauhaus from 'components/Bauhaus';
import { InputPassword, InputText } from 'components/Forms';
import Info from './Info';

import alert from '../../assets/alert.png';
import './styles.css';
import Alert from './Alert';

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
          mb="20"
          textAlign={{sm: 'center', lg: 'left'}}
        >
          Daftarkan SSO untuk Update Jadwal
        </Text>
        <Info />
        <form className="form-container" onSubmit={handleSubmit(onSubmit)} >
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
          <Alert />
          <Button
            mt={8}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            disabled={isSubmitSuccessful}
            w={{sm: '100%', lg: 'unset'}}
          >
            Update Jadwal
          </Button>
        </form>
      </Box>
    </>
  );
};

export default LoginSso;