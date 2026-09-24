/**
 * Helpers for the server-side course filtering API:
 * /susunjadwal/api/majors/<kd_org>/courses_by_kd
 *
 * Supported query params:
 * - categories   : Kelas Internal, Kelas Eksternal, Kelas Bersama (multiple)
 * - courses      : course name/code search (multiple)
 * - fuzzy        : enable fuzzy matching for `courses`
 * - days         : Senin, Selasa, ... (multiple)
 * - strict_days  : all class sessions must be on the requested days
 * - start_time / end_time : HH:MM (or HH.MM) time range
 * - strict_time  : all class sessions must be within the time range
 * - sks / sks_op : SKS count with operator ('eq', 'lt', 'gt')
 *
 * dikasih jocim makasih jocim
 */

export const COURSE_CATEGORIES = [
  "Kelas Internal",
  "Kelas Eksternal",
  "Kelas Bersama",
];

export const COURSE_DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export const SKS_OPERATORS = [
  { value: "eq", label: "Sama dengan" },
  { value: "lt", label: "Kurang dari" },
  { value: "gt", label: "Lebih dari" },
];

export const DEFAULT_COURSE_FILTERS = {
  categories: [],
  days: [],
  strictDays: false,
  startTime: "",
  endTime: "",
  strictTime: false,
  sks: "",
  sksOp: "eq",
  fuzzy: false,
};

const hasValue = (value) =>
  value !== "" && value !== null && value !== undefined;

/**
 * Number of active filter values
 */
export const countActiveFilters = (filters) => {
  if (!filters) return 0;
  let count = (filters.categories?.length ?? 0) + (filters.days?.length ?? 0);
  if (hasValue(filters.startTime)) count += 1;
  if (hasValue(filters.endTime)) count += 1;
  const sksNumber = Number(filters.sks);
  if (!Number.isNaN(sksNumber) && sksNumber > 0) count += 1;
  return count;
};

/**
 * Builds the query params object for courses_by_kd from the filter state
 * Returns null when nothing is active (i.e. fetch without params)
 * The keyword is only sent server-side when fuzzy search is enabled
 */
export const buildCourseFilterParams = (filters, keyword = "") => {
  if (!filters) return null;

  const params = {};

  if (filters.categories?.length) {
    params.categories = filters.categories;
  }

  if (filters.days?.length) {
    params.days = filters.days;
    if (filters.strictDays) {
      params.strict_days = true;
    }
  }

  if (hasValue(filters.startTime)) {
    params.start_time = filters.startTime;
  }
  if (hasValue(filters.endTime)) {
    params.end_time = filters.endTime;
  }
  if (
    (hasValue(filters.startTime) || hasValue(filters.endTime)) &&
    filters.strictTime
  ) {
    params.strict_time = true;
  }

  const sksNumber = Number(filters.sks);
  if (!Number.isNaN(sksNumber) && sksNumber > 0) {
    params.sks = sksNumber;
    params.sks_op = filters.sksOp || "eq";
  }

  const trimmedKeyword = (keyword || "").trim();
  if (trimmedKeyword && filters.fuzzy) {
    params.courses = [trimmedKeyword];
    params.fuzzy = true;
  }

  return Object.keys(params).length > 0 ? params : null;
};

const parseTimeToMinutes = (time) => {
  if (!time) return null;
  const [hours, minutes] = String(time).replace(".", ":").split(":");
  const h = Number(hours);
  if (Number.isNaN(h)) return null;
  return h * 60 + (Number(minutes) || 0);
};

/**
 * Client-side mirror of the server-side filters, applied to the fetched
 * courses as a safety net in case the backend ignores/miss-parses the query
 * params (e.g. array serialization). With a compliant backend this is a
 * no-op since the server already returns only matching courses.
 */
export const applyClientSideCourseFilters = (courses, filters) => {
  if (!courses || !filters) return courses;

  const categories = filters.categories ?? [];
  const days = filters.days ?? [];
  const startTime = parseTimeToMinutes(filters.startTime);
  const endTime = parseTimeToMinutes(filters.endTime);
  const sksNumber = Number(filters.sks);
  const hasSks = !Number.isNaN(sksNumber) && sksNumber > 0;
  const sksOp = filters.sksOp || "eq";

  if (
    !categories.length &&
    !days.length &&
    startTime == null &&
    endTime == null &&
    !hasSks
  ) {
    return courses;
  }

  return courses.filter((course) => {
    if (categories.length && !categories.includes(course.category)) {
      return false;
    }

    if (hasSks) {
      const credit = Number(course.credit);
      const matches =
        sksOp === "lt"
          ? credit < sksNumber
          : sksOp === "gt"
          ? credit > sksNumber
          : credit === sksNumber;
      if (!matches) return false;
    }

    if (days.length || startTime != null || endTime != null) {
      const classes = course.classes ?? [];
      if (!classes.length) return false;

      const matchesDay = (cls) => {
        if (!days.length) return true;
        const items = cls.schedule_items ?? [];
        if (!items.length) return false;
        if (filters.strictDays) {
          return items.every((item) => days.includes(item.day));
        }
        return items.some((item) => days.includes(item.day));
      };

      const matchesTime = (cls) => {
        if (startTime == null && endTime == null) return true;
        const items = cls.schedule_items ?? [];
        if (!items.length) return false;
        const itemMatches = (item) => {
          const start = parseTimeToMinutes(item.start);
          const end = parseTimeToMinutes(item.end) ?? start;
          if (start == null) return false;
          if (startTime != null && start < startTime) return false;
          if (endTime != null && end > endTime) return false;
          return true;
        };
        if (filters.strictTime) {
          return items.every(itemMatches);
        }
        return items.some(itemMatches);
      };

      const hasMatchingClass = classes.some(
        (cls) => matchesDay(cls) && matchesTime(cls),
      );
      if (!hasMatchingClass) return false;
    }

    return true;
  });
};

/**
 * dedup fetch
 */
export const buildCourseFilterFetchSignature = (
  majorId,
  majorSelected,
  filterParams,
) =>
  `${majorId ?? ""}|${majorSelected?.kd_org ?? ""}|${
    filterParams ? JSON.stringify(filterParams) : ""
  }`;
