import React from 'react';
import { Text } from '@chakra-ui/react';

import alert from '../../../assets/alert.png';
import './styles.css';

const Alert = () => (
  <div className="alert-container">
    <div className="alert">
      <img src={alert} alt="alert"/>
    </div>
    <Text fontSize="sm">
      Dengan menekan tombol ini, Anda setuju bahwa SusunJadwal
      akan menggunakan data SSO Anda untuk melakukan scraping ke
      ebsite SIAK-NG untuk mengumpulkan kelas yang dapat Anda ambil.
    </Text>
  </div>
);

export default Alert;