import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Text, Box, Button, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { getContributors } from "services/api";
import { ContributorCard } from "components/Cards";

const Contributors = () => {
  const [contributors, setContributors] = useState();

  const fetchContributors = useCallback(async () => {
    try {
      const { data } = await getContributors();
      setContributors(data);
      console.log(data);
    } catch (error) {
      alert("error");
    }
  }, []);
  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

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
    <Box mt='-4rem'>
      <Link to="/">
        <Text fontSize={{base: 'sm', md:"lg"}} color="primary.Purple" ml="-9px">
          <ChevronLeftIcon w={8} h={8} />
          Kembali ke Halaman Utama
        </Text>
      </Link>

      <Box textAlign="center" mt='2rem'>
        <Text fontWeight="bold" fontSize={{base: 'x-large', md:"xx-large"}} color="primary.Purple">
          Kontributor{" "}
          <Box as="span" color="secondary.MineShaft">
            Susun
          </Box>
          Jadwal
        </Text>
        <Text
          mt="1.5rem"
          fontSize={{ base: "xs", md: "md" }}
          px={{ md: "8rem" }}
        >
          Kami menyambut segala bentuk kontribusi, besar maupun kecil, untuk
          membantu menciptakan teknologi yang memberi dampak positif bagi
          kehidupan mahasiswa Universitas Indonesia.
        </Text>

        <Button m="2rem auto 3rem">Gabung Discord SusunJadwal</Button>
      </Box>

      <Flex
        w="fit-content"
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
