import { Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ListIcon } from "./const";
import { StyledIconWrapper } from "./styles";

const SocialContainer = () => {
  const [listOfIcons, setListOfIcons] = useState([]);

  useEffect(() => {
    let list = importAll(
      require.context("assets/Beta/icons", false, /\.(svg)$/)
    );
    
    list = list.map((img, idx) => ({
      image: img,
      link: ListIcon[idx].url,
    }));
    setListOfIcons(list);
  }, []);

  const importAll = (r) => {
    return r.keys().map(r);
  };
  return (
    <StyledIconWrapper>
      {listOfIcons.map((item, id) => (
        <a target="_blank" rel="noopener noreferrer" key={id} href={item.link}>
          <Image
            objectFit="contain"
            w="6"
            mx="5"
            src={item.image}
            alt={"image"}
          />
        </a>
      ))}
    </StyledIconWrapper>
  );
};

export default SocialContainer;
