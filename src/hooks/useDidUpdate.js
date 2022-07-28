import { useEffect, useRef } from "react";

/**
 *  useDidUpdate hook
 *
 *  Works similar to componentDidUpdate.
 *  Run Callback when dependencies change. Will not run on first render.
 *
 *  usage:
 *
 *  useDidUpdate(() => {
 *    console.log(count)
 *  }, [count])
 */
const useDidUpdate = (callback, deps) => {
  const hasMountedRef = useRef(false);
  if (typeof deps !== "undefined" && !Array.isArray(deps)) {
    deps = [deps];
  } else if (Array.isArray(deps) && deps.length === 0) {
    console.warn(
      "Using [] as the second argument makes useDidUpdate more like a componentDidMount.",
    );
  }
  useEffect(() => {
    if (hasMountedRef.current) {
      callback();
    } else {
      hasMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useDidUpdate;
