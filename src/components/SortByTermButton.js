import React from "react";
import { useSelector } from "react-redux";
import { Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, IconButton, useColorModeValue } from "@chakra-ui/react";
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";

const sortIconProps = {
  color: "white",
  width: "2rem",
  height: "2rem",
}

const SortByTermButton = ({ isSortByLatest, setSortByLatest }) => {
  const theme = useColorModeValue("light", "dark");
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={isSortByLatest ? <SortDescendingIcon {...sortIconProps} /> : <SortAscendingIcon {...sortIconProps} />}
        variant='outline'
        p="5px"
        h={isMobile ? "44px" : "57px"}
        w={isMobile ? "44px" : "57px"}
        ml={isMobile ? "0.75rem" : "1rem"}
        bg={
          theme === "light" ? "primary.Purple" : "primary.LightPurple"
        }
        cursor="pointer"
        borderRadius="8px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      />
      <MenuList>
        <MenuOptionGroup defaultValue='desc' title='Urut Berdasarkan' type='radio'>
          <MenuItemOption onClick={() => setSortByLatest(true)} value='desc'>Semester Terbaru</MenuItemOption>
          <MenuItemOption onClick={() => setSortByLatest(false)} value='asc'>Semester Terlama</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

export default SortByTermButton