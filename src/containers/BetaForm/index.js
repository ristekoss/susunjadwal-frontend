import React from 'react'
import { Box, Text, Button } from '@chakra-ui/react';
import { InputEmail, InputSelect, InputText } from 'components/Forms';
import { useForm } from 'react-hook-form';
import { postBetaTesterData } from 'services/api';

const BetaForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    postBetaTesterData(values);
  }

  return (
    <Box>
      <Text fontSize="3xl" fontWeight="bold">Lengkapi Formulir untuk Menjadi Beta Tester</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          label="Nama lengkap"
          name="nama"
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
          register={register}
          validator={{
            required: `Harap Pilih`
          }}
          errors={errors}
        >
          <option value="Reguler">Reguler</option>
          <option value="Pararel">Pararel</option>
        </InputSelect>

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  )
}

export default BetaForm
