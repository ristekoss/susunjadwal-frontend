import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

/**
 * Custom hook to prevent schedule reset during component re-renders
 * caused by window resize, responsive changes, etc.
 */
export const useSchedulePersistence = () => {
  const schedules = useSelector((state) => state.schedules);
  const courses = useSelector((state) => state.courses);
  const dispatch = useDispatch();

  const prevSchedules = useRef([]);
  const prevCourses = useRef({});
  const hasRestoredSchedules = useRef(false);

  useEffect(() => {
    if (
      schedules.length === 0 &&
      prevSchedules.current.length > 0 &&
      Object.keys(courses).length > 0 &&
      !hasRestoredSchedules.current
    ) {
      prevSchedules.current.forEach((schedule) => {
        const key = `${schedule.parentName}-${schedule.name}-${schedule.term}-${schedule.schedule_items[0].room}`;

        if (courses[key] !== undefined) {
          dispatch({
            type: "schedules/addSchedule",
            payload: schedule,
          });

          dispatch({
            type: "courses/setCourseSelected",
            payload: { key, selected: true },
          });
        }
      });

      hasRestoredSchedules.current = true;

      setTimeout(() => {
        hasRestoredSchedules.current = false;
      }, 1000);
    }

    if (schedules.length > 0) {
      prevSchedules.current = [...schedules];
    }

    if (Object.keys(courses).length > 0) {
      prevCourses.current = { ...courses };
    }
  }, [schedules, courses, dispatch]);

  const saveSchedulesToSessionStorage = useCallback(() => {
    if (schedules.length > 0) {
      try {
        sessionStorage.setItem(
          "siak_war_schedules_backup",
          JSON.stringify({
            schedules: schedules,
            courses: courses,
            timestamp: Date.now(),
          }),
        );
      } catch (e) {
        console.warn("Could not save schedules to sessionStorage:", e);
      }
    }
  }, [schedules, courses]);

  const restoreSchedulesFromSessionStorage = useCallback(() => {
    try {
      const backup = sessionStorage.getItem("siak_war_schedules_backup");
      if (backup) {
        const {
          schedules: savedSchedules,
          courses: savedCourses,
          timestamp,
        } = JSON.parse(backup);

        if (Date.now() - timestamp < 3600000) {
          savedSchedules.forEach((schedule) => {
            dispatch({
              type: "schedules/addSchedule",
              payload: schedule,
            });
          });

          Object.keys(savedCourses).forEach((key) => {
            if (savedCourses[key]) {
              dispatch({
                type: "courses/setCourseSelected",
                payload: { key, selected: true },
              });
            }
          });

          return true;
        }
      }
    } catch (e) {
      console.warn("Could not restore schedules from sessionStorage:", e);
    }
    return false;
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (schedules.length > 0) {
        saveSchedulesToSessionStorage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [schedules, saveSchedulesToSessionStorage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSchedulesToSessionStorage();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveSchedulesToSessionStorage]);

  return {
    saveSchedulesToSessionStorage,
    restoreSchedulesFromSessionStorage,
    hasSchedules: schedules.length > 0,
    schedulesCount: schedules.length,
  };
};
