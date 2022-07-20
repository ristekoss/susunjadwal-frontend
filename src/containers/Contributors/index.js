import React, { useCallback, useEffect, useState } from "react";
import { Text, Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

import { ContributorCard } from "components/Cards";
import { getContributorsFrontend, getContributorsBackend } from "services/api";

const Contributors = () => {
  const [contributorsFE, setContributorsFE] = useState();
  const [contributorsBE, setContributorsBE] = useState();

  const theme = useColorModeValue("light", "dark");
  const fetchContributors = useCallback(async () => {
    try {
      const dataFE = await getContributorsFrontend();
      const dataBE = await getContributorsBackend();
      setContributorsFE(dataFE.data);
      setContributorsBE(dataBE.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  if (contributorsFE && contributorsBE) {
    // if contributors from FE and BE fetched
    // get unique username from FE
    var usernames = new Set(contributorsFE?.map((c) => c.login));

    // for each username in FE, if username in BE then add contributions on FE user
    usernames.forEach((username) => {
      if (
        contributorsBE.some((contributorBE) => contributorBE.login === username)
      ) {
        const indexFE = contributorsFE.findIndex((fe) => fe.login === username);
        const indexBE = contributorsBE.findIndex((be) => be.login === username);

        contributorsFE[indexFE].contributions +=
          contributorsBE[indexBE].contributions;
      }
    });

    // merge contributor in FE and contributor BE(except username exist in FE)
    // then sort from most contributions
    var contributors = [
      ...contributorsFE,
      ...contributorsBE?.filter((d) => !usernames.has(d.login)),
    ].sort((a, b) => (a.contributions > b.contributions ? -1 : 1));
  }

  const contributionList = contributors?.map((user) => (
    <ContributorCard
      key={user.id}
      name={user.login}
      avatar={user.avatar_url}
      github={user.html_url}
      contributions={user.contributions}
    />
  ));

  return (
    <Box mt={{ base: "calc(-5rem)", lg: "-4rem" }}>
      <Helmet title="Kontributor SusunJadwal" />

      <Link to="/">
        <Text
          fontSize={{ base: "sm", md: "lg" }}
          color={theme === "light" ? "primary.Purple" : "dark.Purple"}
          ml="-9px"
        >
          <ChevronLeftIcon w={8} h={8} />
          Kembali ke Halaman Utama
        </Text>
      </Link>

      <Box textAlign="center" mt={{ base: "1rem", lg: "2rem" }}>
        <Text
          fontWeight="bold"
          fontSize={{ base: "x-large", md: "xx-large" }}
          color={theme === "light" ? "primary.Purple" : "dark.Purple"}
        >
          Kontributor{" "}
          <Box
            as="span"
            color={theme === "light" ? "secondary.MineShaft" : "dark.White"}
          >
            Susun
          </Box>
          Jadwal
        </Text>
        <Text
          mt="1.5rem"
          fontSize={{ base: "xs", md: "md" }}
          px={{ md: "8rem" }}
          color={theme === "light" ? "black" : "dark.White"}
        >
          Kami menyambut segala bentuk kontribusi, besar maupun kecil, untuk
          membantu menciptakan teknologi yang memberi dampak positif bagi
          kehidupan mahasiswa Universitas Indonesia.
        </Text>

        <Button
          m="2rem auto 3rem"
          bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
          color={theme === "light" ? "white" : "dark.White"}
        >
          Gabung Discord SusunJadwal
        </Button>
      </Box>

      <Flex
        w="fit-content"
        minH="90vh"
        mx="auto"
        gridGap="20px"
        wrap="wrap"
        justify="center"
      >
        {contributionList}
      </Flex>
    </Box>
  );
};

export default Contributors;
