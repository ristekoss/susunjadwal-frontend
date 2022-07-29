import React, { lazy, Suspense } from "react";
const MoreOptions = lazy(() =>
  import(/* webpackChunkName: "MoreOptions" */ "./MoreOptions.js"),
);
const MoreOptionsWrapper = (props) => (
  <Suspense fallback={"..."}>
    <MoreOptions {...props} />
  </Suspense>
);

export default MoreOptionsWrapper;
