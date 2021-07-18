import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { setAuth } from "redux/modules/auth";
import { makeAtLeastMs } from "utils/promise";
import FACULTIES from "utils/faculty-base.json";
import { setLoading } from "redux/modules/appState";
import { postSsoCompletionData } from "services/api";
import {
  persistAuth,
  loadCompletion,
  persistCompletion
} from "utils/auth";

import { InputSelect, InputText } from "components/Forms";
import { Bauhaus } from "components/Bauhaus";

const CompleteForm = ({ history }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
  } = useForm();

  const auth = useSelector(state => state.auth);
  const selectedFaculty = watch("fakultas");
  const dispatch = useDispatch();

  const [completionData, setCompletionData] = useState(null);
  const [completionId, setCompletionId] = useState(null);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);

  const onSubmit = async (value) => {
    const { npm, jurusan } = value
    const kdOrg = jurusan.split(" - ")[2]

    try {
      dispatch(setLoading(true))

      const {
        data: {
          major_id: majorId,
          user_id: userId,
          token,
          err: isPeriodMissing,
        }
      } = await makeAtLeastMs(postSsoCompletionData({ completionId, npm, kdOrg }), 1000);

      dispatch(setLoading(false));
      dispatch(setAuth({ majorId, userId, token }));
      persistAuth({ majorId, userId, token });
      persistCompletion();

      if (isPeriodMissing) {
        window.location.replace("/update");
        return null;
      }
    } catch (e) {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (auth) history.push("/susun");
  }, [auth, history]);

  useEffect(() => {
    const completion = loadCompletion();
    setCompletionData(completion)
  }, [])

  useEffect(() => {
    setUsername(completionData?.username);
    setFullname(completionData?.fullname);
    setCompletionId(completionData?.completionId);
  }, [completionData])

  return (
    <>
      <Bauhaus />
      <Box width={{lg:'80%', xl: '70%'}}>
        <Link to="/">
          <Text color="var(--chakra-colors-primary-Purple)" fontSize="lg" ml='-9px'>
            <ChevronLeftIcon w={8} h={8} />
            Kembali ke Halaman Utama
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            mt="4"
            textAlign={{sm: 'center', lg: 'left'}}
          >
            Lengkapi Informasi untuk Susun<span style={{ color: "#5038BC" }}>Jadwal</span>
          </Text>
        </Link>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText
            label="Nama Lengkap"
            name="nama"
            marginTop="1rem"
            register={register}
            disabled={true}
            placeholder={fullname}
            validator={{required: false}}
            errors={errors}
          />

          <InputText
            label="Username SSO"
            name="email"
            marginTop="1rem"
            register={register}
            disabled={true}
            placeholder={username}
            validator={{required: false}}
            errors={errors}
          />

          <InputText
            label="NPM"
            name="npm"
            marginTop="1rem"
            register={register}
            validator={{ required: `NPM tidak boleh kosong` }}
            errors={errors}
          />

          <InputSelect
            label="Fakultas"
            name="fakultas"
            marginTop="1rem"
            register={register}
            placeholder="Pilih Fakultas"
            validator={{ required: `Harap Pilih` }}
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
            validator={{ required: `Harap Pilih` }}
            errors={errors}
            disabled={!selectedFaculty}
          >
            {selectedFaculty && FACULTIES[selectedFaculty].map(jurusan => (
              <option key={jurusan.kd_org}>
                {`${jurusan.educational_program} - ${jurusan.study_program} - ${jurusan.kd_org}`}
              </option>
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
