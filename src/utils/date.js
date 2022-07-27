const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const dayToColumn = (day) => DAYS.indexOf(day) + 1;

export function getDayOfCurrentWeek(day, date = new Date()) {
  const _day = date.getDay();
  if (_day !== day) date.setHours(-24 * (_day - day));
  return date;
}
