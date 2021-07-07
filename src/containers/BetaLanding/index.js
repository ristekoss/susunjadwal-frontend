import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";

import {
  Title,
  GapBox,
  FlexBox,
  FlexItem,
  TextBox,
  Paragraph,
  AssetBetaA,
  AssetBetaB,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AssetBauhaus,
  LogoRistek,
  LogoSunjadBeta
} from "./styles";

import Bauhaus from "assets/Beta/decor1.svg";
import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
import BetaAssetA from "assets/Beta/beta-landing-asset-1.svg";
import BetaAssetB from "assets/Beta/beta-landing-asset-2.svg";

const BetaLanding = () => {
  return (
    <>
      <AssetBauhaus src={Bauhaus} alt="bauhaus" />
      <Box>
        <LogoRistek src={RistekBetaLogo} alt="ristek-logo" />
        <LogoSunjadBeta src={SunjadBetaLogo} alt="sunjad-beta-logo" />
      </Box>

      <FlexBox flexDir={{ base: "column-reverse", lg: "row" }}>
        <TextBox>
          <Title>Apa itu SusunJadwal?</Title>
          <Paragraph>
            SusunJadwal merupakan situs untuk membantu kamu menentukan jadwal kuliah
            yang akan kamu ambil dalam suatu semester. Dengan SusunJadwal, peluang
            kamu menang SIAK War akan lebih besar, loh!
          </Paragraph>
        </TextBox>
        <FlexItem display="flex" justifyContent="center">
          <AssetBetaA src={BetaAssetA} alt="beta-landing-asset-1" />
        </FlexItem>
      </FlexBox>

      <FlexBox flexDir={{ base: "column", lg: "row" }}>
        <FlexItem display="flex" justifyContent={{ base: "center", lg: "flex-start" }} >
          <AssetBetaB src={BetaAssetB} alt="beta-landing-asset-2" />
        </FlexItem>
        <TextBox>
          <Title>Jadilah beta tester SusunJadwal!</Title>
          <Paragraph>
            Mau membantu kami meningkatkan kualitas SusunJadwal? Jadilah beta tester kami
            untuk mencobafitur-fitur yang ada pada SusunJadwal sebelum SIAK War dimulai!
          </Paragraph>
          <Link to="/beta-form" >
            <Button
              variant="solid"
              mt={{ base: "1rem", lg: "1.75rem" }}
              w="fit-content"
            >
              Jadi Beta Tester
            </Button>
          </Link>
        </TextBox>
      </FlexBox>

      <GapBox>
        <Title>Beta Testing FAQs</Title>
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Apa itu SusunJadwal Beta?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              SusunJadwal Beta adalah upaya kami dalam menjaga kualitas dari SusunJadwal
              dengan melibatkan kamu sebagai beta tester. Selain itu, SusunJadwal Beta juga
              bertujuan untuk mengumpulkan data jadwal kuliah dari seluruh program studi di
              Universitas Indonesia.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Apa itu Beta Tester?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Dengan mendaftar sebagai Beta Tester, kamu akan berkesempatan untuk mencoba iterasi
              terbaru dari aplikasi SusunJadwal. Selama hampir 10 tahun, versi terbaru SusunJadwal
              hanya dicoba oleh mahasiswa Fasilkom UI. Sekarang, untuk pertama kalinya, kami akan
              membuka pintu kami kepada kalian semua.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Kenapa SusunJadwal harus mengumpulkan jadwal?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Jawaban singkatnya, karena kami tidak diberikan akses jadwal oleh Universitas Indonesia,
              sehingga kami harus melakukan scraping. Untuk jawaban lengkapnya kamu dapat mengunjungi
              <u>halaman ini</u>.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Apa saja keuntungan yang bisa saya dapatkan dengan menjadi Beta Tester?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Dengan menjadi Beta Tester, anda dapat menjadi orang pertama di Program Studi
              anda yang mencoba SusunJadwal. Selain itu, anda juga dapat memberikan feedback
              langsung kepada kami.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Bagaimana cara saya mendaftar menjadi Beta Tester?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Untuk mendaftar sebagai Beta Tester, silahkan hubungi Humas BEM fakultas masing-masing
              atau dapat langsung daftar lewat website SusunJadwal.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </GapBox>
    </>
  )
};

export default BetaLanding;