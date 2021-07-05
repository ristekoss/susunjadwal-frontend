import React from 'react'
import { Box, Text, Button } from '@chakra-ui/react';
import { InputEmail, InputSelect, InputText } from 'components/Forms';
import { useForm } from 'react-hook-form';
import { postBetaTesterData } from 'services/api';
import FACULTIES from 'utils/faculty-base.json';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { InfoToast, SuccessToast } from 'components/Toast';

const BetaForm = ({history}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch
  } = useForm();

  const selectedFaculty = watch('fakultas');

  async function onSubmit(values) {
    try {
      await postBetaTesterData(values);
      SuccessToast('Terima Kasih sudah menjadi Beta Tester kami. Tim kami akan segera menghubungi Kamu.');
      history.push('/');
    } catch (error) {
      InfoToast('Maaf ada sedikit kesalahan nih, silakan hubungi contact person');
      throw error;
    }
  }

  return (
    <Box width={{lg:'80%', xl: '70%'}}>
      <Link to="/">
        <Text color="var(--chakra-colors-primary-Purple)" fontSize="lg" ml='-9px'>
          <ChevronLeftIcon w={8} h={8} />
          Kembali ke Halaman Utama
        </Text>
      </Link>
      <Text fontSize="3xl" fontWeight="bold" mt="4">Lengkapi Formulir untuk Menjadi Beta Tester</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          label="Nama lengkap"
          name="nama"
          marginTop="1rem"
          register={register}
          placeholder="Nama lengkap"
          validator={{
            required: `Nama lengkap tidak boleh kosong`,
            minLength: { value: 3, message: "Minimum length should be 3" },
          }}
          errors={errors}
        />

        <InputEmail
          label="Email"
          name="email"
          marginTop="1rem"
          register={register}
          placeholder="Email"
          validator={{
            required: `Harap masukan Email`,
          }}
          errors={errors}
        />

        <InputText
          label="ID LINE / Nomor HP"
          name="line_hp"
          marginTop="1rem"
          register={register}
          placeholder="ID LINE / Nomor HP"
          validator={{
            required: `Harap isi ID LINE / Nomor HP`,
          }}
          errors={errors}
        />

        <InputSelect
          label="Fakultas"
          name="fakultas"
          marginTop="1rem"
          register={register}
          placeholder="--- Pilih Fakultas ---"
          validator={{
            required: `Harap Pilih`
          }}
          errors={errors}
        >
          {Object.keys(FACULTIES).map(faculty=>
            <option key={faculty} value={faculty}>{faculty}</option>  
          )}
        </InputSelect>

        <InputSelect
          label="Program Studi"
          name="program_studi"
          marginTop="1rem"
          register={register}
          placeholder="--- Pilih Program Studi ---"
          validator={{
            required: `Harap Pilih`
          }}
          errors={errors}
          disabled={!selectedFaculty}
        >
          {selectedFaculty &&  FACULTIES[selectedFaculty].map(prodi=>
            <option key={prodi.kd_org}>{`${prodi.educational_program} - ${prodi.study_program}`}</option>  
          )}
        </InputSelect>

        <Button
          mt={8}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          disabled={isSubmitSuccessful}
        >
          Submit
        </Button>
      </form>
    </Box>
  )
}

export default BetaForm
