import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSchedule, removeSchedule } from "redux/modules/schedules";

export const UNDO_DISMISS_MS = 5000;

const sameSchedule = (a, b) =>
  a.parentName === b.parentName &&
  a.name === b.name &&
  String(a.term) === String(b.term);

export const useUndoAction = () => {
  const schedules = useSelector((state) => state.schedules);
  const dispatch = useDispatch();
  const [lastAction, setLastAction] = useState(null);
  const prevSchedulesRef = useRef(schedules);
  const skipNextDiffRef = useRef(false);
  const actionIdRef = useRef(0);

  useEffect(() => {
    const prev = prevSchedulesRef.current;
    prevSchedulesRef.current = schedules;

    if (skipNextDiffRef.current) {
      skipNextDiffRef.current = false;
      return;
    }

    const added = schedules.find((s) => !prev.some((p) => sameSchedule(p, s)));
    const removed = prev.find(
      (p) => !schedules.some((s) => sameSchedule(s, p)),
    );

    const lengthDiff = schedules.length - prev.length;

    if (added && (!removed || lengthDiff === 0)) {
      actionIdRef.current += 1;
      setLastAction({ id: actionIdRef.current, type: "add", course: added });
    } else if (!added && removed && lengthDiff === -1) {
      actionIdRef.current += 1;
      setLastAction({
        id: actionIdRef.current,
        type: "remove",
        course: removed,
      });
    }
  }, [schedules]);

  useEffect(() => {
    if (!lastAction) return undefined;
    const timer = setTimeout(() => setLastAction(null), UNDO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [lastAction]);

  const undo = useCallback(() => {
    if (!lastAction) return;
    skipNextDiffRef.current = true;
    if (lastAction.type === "add") {
      dispatch(removeSchedule(lastAction.course));
    } else {
      dispatch(addSchedule(lastAction.course));
    }
    setLastAction(null);
  }, [lastAction, dispatch]);

  return { lastAction, undo };
};

export default useUndoAction;
