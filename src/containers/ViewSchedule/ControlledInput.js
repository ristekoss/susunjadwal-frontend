import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import AutosizeInput from "react-input-autosize";

import editImg from "assets/edit_black.png";

class ControlledInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.name ? props.name : "Untitled"
    };
  }

  submit() {
    let title = this.state.title;
    if (title.length === 0) {
      title = "Untitled";
    }
    this.setState({
      title: title,
      editing: false
    });
    //TODO: PATCH the schedule with new name=this.state.title
    this.props.rename(this.props.slug, title);
  }

  changeScheduleName(action) {
    const node = ReactDOM.findDOMNode(this);
    const child = node.querySelector("input[name='form-field-schedule-name']");
    if (action === "focus") {
      child.focus();
    } else {
      child.blur();
    }
  }

  render() {
    return (
      <Container>
        {/* TODO: Disable spellcheck */}
        <AutosizeInput
          name="form-field-schedule-name"
          value={this.state.title}
          maxLength="20"
          onChange={event => {
            this.setState({
              title: event.target.value
            });
          }}
          onFocus={() => {
            this.setState({
              editing: true
            });
          }}
          onBlur={() => {
            this.submit();
          }}
          onKeyDown={event => {
            if (event.key === "Enter") {
              this.changeScheduleName("blur");
            }
          }}
        />
        <button
          className={this.state.editing ? "hide" : ""}
          onClick={() => {
            this.changeScheduleName("focus");
          }}
        >
          <img
            src={editImg}
            alt="Edit"
          />
        </button>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: #333333;
  background-color: transparent;

  input {
    font-size: 24px;
    margin-right: 12px;
    background-color: transparent;
    overflow: visible;

    border: 2px solid transparent !important;
  }

  img {
    width: 18px;
    height: 18px;
  }

  input:focus {
    outline: none !important;
    border-radius: 4px !important;
    border: 2px solid ${props => props.theme.color.primaryPurple} !important;
  }

  @media (min-width: 900px) {
    input {
      margin-right: 8px;
      font-size: 32px;
    }
  }
`;

export default ControlledInput;