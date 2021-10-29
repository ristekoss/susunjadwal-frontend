import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import styled from "styled-components";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
const Dropdown = ({ DropdownItems }) => {
  return (
    <DropdownContainer>
      <Menu autoSelect={false} placement="right-start">
        <MenuButton>
          <DotsHorizontalIcon style={{ marginTop: "10px" }} width={15} />
        </MenuButton>
        <MenuList>
          {DropdownItems.map((item) => {
            return (
              <MenuItem icon={item.icon} onClick={item.action}>
                {item.text}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </DropdownContainer>
  );
};
const DropdownContainer = styled.div`
  z-index: 2;
`;
export default Dropdown;
