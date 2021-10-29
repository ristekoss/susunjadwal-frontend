import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import styled from "styled-components";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import CopyToClipboard from "react-copy-to-clipboard";
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
              <>
                {item.copy ? (
                  <CopyToClipboard
                    text={`${window.location.href}/${item.scheduleId}`}
                    onCopy={item.action}
                  >
                    <MenuItem icon={item.icon}>
                      <div>{item.text}</div>
                    </MenuItem>
                  </CopyToClipboard>
                ) : (
                  <MenuItem icon={item.icon} onClick={item.action}>
                    <div>{item.text} </div>
                  </MenuItem>
                )}
              </>
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
