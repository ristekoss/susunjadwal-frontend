import styled from "styled-components";
import React from "react";

const Info = () => (
  <InfoContainer className="info-container">
    <Question>
      Apa itu Update Jadwal?
    </Question>
    <Answer>
      Update Jadwal adalah fitur yang membolehkan penggunanya untuk memperbarui
      jadwal kuliah dari program studi masing-masing.
    </Answer>
    <Question>
      Kenapa perlu Update Jadwal?
    </Question>
    <Answer>
      SusunJadwal tidak bekerjasama dengan pihak UI. Sehingga, SusunJadwal perlu
      untuk mengumpulkan data jadwal kuliah mahasiswa dari seluruh program studi
      agar SusunJadwal dapat digunakan.
    </Answer>
    <Question>
      Apakah akun SSO saya aman setelah melakukan Update Jadwal?
    </Question>
    <Answer>
      100% aman, karena kami sama sekali tidak menyimpan <em>credentials</em> kalian
      di sistem kami.
    </Answer>
    <Question>
      Saya masih ragu, apakah saya dapat mempelajari SusunJadwal?
    </Question>
    <Answer>
      Kami suka semangat keingintahuanmu! Untuk mempelajari bagaimana SusunJadwal
      bekerja, kamu dapat lihat di laman ini.
    </Answer>
  </InfoContainer>
);

export default Info;

const InfoContainer = styled.ul`
  padding: 2rem 1.5rem 2rem calc(1rem + 24px);
  background-color: #F8F8F8;
  border: 1px solid #5038BC;
  font-family: 'Poppins';
  border-radius: 0.8rem;
  position: relative;
  z-index: 10;

  @media (min-width: 900px) {
    padding: 3rem 2.5rem 3rem calc(2rem + 24px);
  }
`;

const Question = styled.li`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Answer = styled.p`
  margin-bottom: 1rem;
`;