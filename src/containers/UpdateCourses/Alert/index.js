import React from "react";
import styled from "styled-components";
import { Text } from "@chakra-ui/react";

import alert from "assets/alert.svg";

const Alert = () => (
  <AlertContainer>
    <AlertImage src={alert} alt="alert"/>
    <Text fontSize="sm">
      Dengan menekan tombol ini, Anda setuju bahwa SusunJadwal
      akan menggunakan data SSO Anda untuk melakukan scraping ke
      website SIAK-NG untuk mengumpulkan kelas yang dapat Anda ambil.
    </Text>
  </AlertContainer>
);

export default Alert;

const AlertContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

const AlertImage = styled.img`
  margin-top: 0.3rem;
  margin-right: 0.5rem;
  margin-bottom: auto;
`;