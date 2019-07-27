import React from "react";
import Media from "react-media";
import { useDispatch } from "react-redux";

import { setMobile } from "redux/modules/appState";

export const MOBILE_BREAKPOINT = 900; // MAGIC

function MediaQuery() {
  const dispatch = useDispatch();

  return (
    <Media
      query={{ maxWidth: MOBILE_BREAKPOINT }}
      onChange={matches => dispatch(setMobile(matches))}
    />
  );
}

export default MediaQuery;
