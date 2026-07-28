import React from "react";
import styled from "styled-components";

const Icons = ({ Items }) => {
  return (
    <>
      {Items.map((item, idx) => {
        return (
          <ImageButton
            key={item.desc || idx}
            onClick={item.action}
            data-hover={item.desc}
          >
            <img src={item.icon} alt={item.alt} />
          </ImageButton>
        );
      })}
    </>
  );
};

const ImageButton = styled.div`
  justify-content: center;
  align-items: center;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  position: relative;
  padding: 4px;

  @media (min-width: 600px) {
    margin-left: 1rem;
    padding: 0;
  }

  img {
    width: 22px;
    height: 22px;
    @media (min-width: 600px) {
      width: 28px;
      height: 28px;
    }
  }

  &:before,
  &:after {
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    position: absolute;
  }
  &:before {
    content: attr(data-hover);
    width: max-content;
    max-width: 210px;
    min-height: 32px;
    background-color: #4e4e4e;
    color: #ffffff;
    text-align: center;
    border-radius: 8px;
    padding: 6px;
    right: 0;
    top: 130%;
    font-size: 14px;
  }
  &:after {
    content: "";
    border-style: solid;
    border-color: #4e4e4e transparent;
    border-width: 0 8px 12px;
    top: 100%;
    right: 3px;
  }
  &:hover&:before,
  &:hover&:after {
    opacity: 1;
    visibility: visible;
  }
`;

export default Icons;
