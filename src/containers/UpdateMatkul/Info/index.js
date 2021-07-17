import { Text } from '@chakra-ui/react';
import React from 'react';

import './styles.css';

const Info = () => (
  <div className="container">
    <Text className="title">Apa itu Update Jadwal?</Text>
    <Text className="description">Update Jadwal adalah fitur yang membolehkan penggunanya untuk memperbarui jadwal kuliah dari program studi masing-masing.</Text>
    <Text className="title">Kenapa perlu Update Jadwal?</Text>
    <Text className="description">SusunJadwal tidak bekerjasama dengan pihak UI. Sehingga, SusunJadwal perlu untuk mengumpulkan data jadwal kuliah mahasiswa dari seluruh program studi agar SusunJadwal dapat digunakan.</Text>
    <Text className="title">Apakah akun SSO saya aman setelah melakukan Update Jadwal?</Text>
    <Text className="description">100% aman, karena kami sama sekali tidak menyimpan credentials kalian di sistem kami.</Text>
    <Text className="title">Saya masih ragu, apakah saya dapat mempelajari SusunJadwal?</Text>
    <Text className="description">Kami suka semangat keingintahuanmu! Untuk mempelajari bagaimana SusunJadwal bekerja, kamu dapat lihat di laman ini.</Text>
  </div>
);

export default Info;