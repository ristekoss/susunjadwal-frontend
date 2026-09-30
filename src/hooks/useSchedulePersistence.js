import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSchedules } from "redux/modules/schedules";

const BUILD_DRAFT_KEY = "siak_war_schedules_autosave_build";
const EDIT_DRAFT_KEY_PREFIX = "siak_war_schedules_autosave_edit_";

// Drafts (pick classes but didnt save it yet) older than 24 hours are considered stale and ignored
export const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export const getDraftStorageKey = (page = "build", scheduleId = null) =>
  page === "edit" && scheduleId
    ? `${EDIT_DRAFT_KEY_PREFIX}${scheduleId}`
    : BUILD_DRAFT_KEY;

export function readDraftFromStorage(page = "build", scheduleId = null) {
  try {
    const raw = localStorage.getItem(getDraftStorageKey(page, scheduleId));
    if (!raw) return null;

    const draft = JSON.parse(raw);
    if (!draft || !Array.isArray(draft.schedules)) return null;

    if (Date.now() - draft.timestamp > DRAFT_TTL_MS) {
      localStorage.removeItem(getDraftStorageKey(page, scheduleId));
      return null;
    }

    return draft;
  } catch (e) {
    return null;
  }
}

export function writeDraftToStorage(draft) {
  try {
    localStorage.setItem(
      getDraftStorageKey(draft.page, draft.scheduleId),
      JSON.stringify(draft),
    );
  } catch (e) {
    console.warn("Could not save schedules draft:", e);
  }
}

export function clearDraftFromStorage(page = "build", scheduleId = null) {
  try {
    localStorage.removeItem(getDraftStorageKey(page, scheduleId));
  } catch (e) {
    console.warn("Could not clear schedules draft:", e);
  }
}

/**
 * Autosave the current schedules state every time it changes, restore it
 * when the user comes back, and clear it when the schedule is finalized.
 *
 * @param {object} options
 * @param {"build"|"edit"} [options.page] - Which page the draft belongs to.
 * @param {string|null} [options.scheduleId] - Schedule id for edit page drafts.
 */
export const useSchedulePersistence = ({
  page = "build",
  scheduleId = null,
} = {}) => {
  const schedules = useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  // Keep the legacy name so existing call sites in BuildSchedule keep working
  const saveSchedulesToSessionStorage = useCallback(() => {
    if (schedules.length > 0) {
      writeDraftToStorage({
        schedules,
        page,
        scheduleId,
        timestamp: Date.now(),
      });
    }
  }, [schedules, page, scheduleId]);

  // Autosave on every change made by the user (add/remove/change)
  useEffect(() => {
    if (schedules.length > 0) {
      saveSchedulesToSessionStorage();
    }
  }, [schedules, saveSchedulesToSessionStorage]);

  // BUTTT persist the last state right before the user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSchedulesToSessionStorage();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveSchedulesToSessionStorage]);

  // Restore the last saved draft (if any) into the redux store
  // SET_SCHEDULES also recomputes the selected class checkboxes (gracefully)
  const restoreSchedulesFromSessionStorage = useCallback(() => {
    const draft = readDraftFromStorage(page, scheduleId);
    if (!draft || draft.schedules.length === 0) {
      return false;
    }

    dispatch(setSchedules(draft.schedules));
    return true;
  }, [dispatch, page, scheduleId]);

  // Clear the draft once the schedule has been finalized (saved/deleted)
  const clearSchedulesFromStorage = useCallback(() => {
    clearDraftFromStorage(page, scheduleId);
  }, [page, scheduleId]);

  return {
    saveSchedulesToSessionStorage,
    restoreSchedulesFromSessionStorage,
    clearSchedulesFromStorage,
    hasSchedules: schedules.length > 0,
    schedulesCount: schedules.length,
  };
};
