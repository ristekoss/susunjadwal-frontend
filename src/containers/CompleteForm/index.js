import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import { Bauhaus } from "components/Bauhaus";
import { InputSelect, InputText } from 'components/Forms';
import React from 'react';
import FACULTIES from 'utils/faculty-base.json';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const CompleteForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
  } = useForm();

  const selectedFaculty = watch('fakultas');

  const onSubmit = () => {
    console.log("KIRIM DATA KAMU");
  };

  return (
    <>
      <Bauhaus />
      <Box width={{lg:'80%', xl: '70%'}}>
        <Link to="/">
          <Text color="var(--chakra-colors-primary-Purple)" fontSize="lg" ml='-9px'>
            <ChevronLeftIcon w={8} h={8} />
            Kembali ke Halaman Utama
          </Text>
          <Text fontSize="3xl" fontWeight="bold" mt="4" textAlign={{sm: 'center', lg: 'left'}}>Lengkapi Informasi untuk SusunJadwal</Text>
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText 
            label="Nama Lengkap"
            name="nama"
            marginTop="1rem"
            register={register}
            placeholder="John Doe"
            validator={{
              required: `Nama tidak boleh kosong`,
            }}
            errors={errors}
          />

          <InputText 
            label="Email SSO"
            name="email"
            marginTop="1rem"
            register={register}
            placeholder="johndoe@ui.ac.id"
            validator={{
              required: `Email tidak boleh kosong`,
            }}
            errors={errors}
          />

          <InputText 
            label="NPM"
            name="npm"
            marginTop="1rem"
            register={register}
            placeholder="189271658291"
            validator={{
              required: `NPM tidak boleh kosong`,
            }}
            errors={errors}
          />

          <InputSelect 
            label="Fakultas"
            name="fakultas"
            marginTop="1rem"
            register={register}
            placeholder="Pilih Fakultas"
            validator={{
              required: `Harap Pilih`,
            }}
            errors={errors}
          >
            {Object.keys(FACULTIES).map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </InputSelect>

          <InputSelect
            label="Jurusan"
            name="jurusan"
            marginTop="1rem"
            register={register}
            placeholder="Pilih Program Studi"
            validator={{
              required: `Harap Pilih`
            }}
            errors={errors}
            disabled={!selectedFaculty}
          >
            {selectedFaculty && FACULTIES[selectedFaculty].map(jurusan => (
              <option key={jurusan.kd_org}>{`${jurusan.educational_program} - ${jurusan.study_program}`}</option>
            ))}
          </InputSelect>
          
          <Button
            mt={8}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            disabled={isSubmitSuccessful}
            w={{sm: '100%', lg: 'unset'}}
          >
            Daftar
          </Button>
        </form>
      </Box>
    </>
  );
}

export default CompleteForm;
