import React, { useCallback, useEffect, useState } from "react";
// import { useMixpanel } from "hooks/useMixpanel";
import { Text, Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

import { ContributorCard } from "components/Cards";
import {
  getContributorsFrontend,
  getContributorsBackend,
  getContributorsOldSunjad,
} from "services/api";

const Contributors = () => {
  const [contributorsFE, setContributorsFE] = useState();
  const [contributorsBE, setContributorsBE] = useState();
  const [contributorsSunjad, setContributorsSunjad] = useState();

  const theme = useColorModeValue("light", "dark");
  const fetchContributors = useCallback(async () => {
    try {
      const dataFE = await getContributorsFrontend();
      const dataBE = await getContributorsBackend();
      const dataOldSunjad = await getContributorsOldSunjad();
      setContributorsFE(dataFE.data);
      setContributorsBE(dataBE.data);
      setContributorsSunjad(dataOldSunjad.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  useEffect(() => {
    // useMixpanel.track("open_contributors");
  }, []);

  const MergeContributors = (contributors, otherContributors) => {
    if (contributors && otherContributors) {
      // if contributors from repoA and repoB fetched
      // get unique username from repoA
      var usernames = new Set(contributors?.map((c) => c.login));

      // for each username in repoA, if username in repoB then add contributions on repoA user
      usernames.forEach((username) => {
        if (
          otherContributors.some(
            (contributor) => contributor.login === username,
          )
        ) {
          const indexA = contributors.findIndex(
            (contributor) => contributor.login === username,
          );
          const indexB = otherContributors.findIndex(
            (contributor) => contributor.login === username,
          );

          contributors[indexA].contributions +=
            otherContributors[indexB].contributions;
        }
      });

      // merge contributors in repoA and contributor repoB(except username exist in repoA)
      // then sort from most contributions
      var contributorsMerged = [
        ...contributors,
        ...otherContributors?.filter((d) => !usernames.has(d.login)),
      ].sort((a, b) => (a.contributions > b.contributions ? -1 : 1));
      return contributorsMerged;
    }
  };

  // merge Sunjad FE and Sunjad Be repo contributors
  const mergedNewSunjad = MergeContributors(contributorsFE, contributorsBE);

  // merge Sunjad FE&BE and inactive Sunjad repo
  const mergedOldNewSunjad = MergeContributors(
    mergedNewSunjad,
    contributorsSunjad,
  );

  const contributionList = mergedOldNewSunjad?.map((user) => (
    <ContributorCard
      key={user.id}
      name={user.login}
      avatar={user.avatar_url}
      github={user.html_url}
      contributions={user.contributions}
      // onClick={() => useMixpanel.track("see_contributor_detail")}
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
        <a
          href="https://ristek.link/oss-discord"
          rel="noopener noreferrer"
          // onClick={() => useMixpanel.track("gabung_discord")}
          target="_blank"
        >
          <Button
            m="2rem auto 3rem"
            bg={theme === "light" ? "primary.Purple" : "dark.LightPurple"}
            color={theme === "light" ? "white" : "dark.White"}
          >
            Gabung Discord SusunJadwal
          </Button>
        </a>
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
