const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const dayToColumn = (day) => DAYS.indexOf(day) + 1;

export function getDayOfCurrentWeek(day, date = new Date()) {
  const _day = date.getDay();
  if (_day !== day) date.setHours(-24 * (_day - day));
  return date;
}

export const getFirstDateOfNthDayInAMonth = (dayOfTheWeek, month, year) => {
  let tempDate = new Date(year, month, 1);
  tempDate.setHours(0, 0, 0, 0);

  let day = tempDate.getDay();
  let toNextDay = (dayOfTheWeek - day + 7) % 7;

  tempDate.setDate(tempDate.getDate() + toNextDay);

  return tempDate;
};

export const generateStartingMonth = (term) => {
  const startingMonth = {
    1: 9, // if term is odd, schedule starts on September
    2: 2, // if term is even, schedule starts on February
    3: 7, // if term is short, schedule starts on July
  };

  return startingMonth[term];
};

export const generateRecurrenceRule = (day, term) => {
  const days = {
    0: "SU",
    1: "MO",
    2: "TU",
    3: "WE",
    4: "TH",
    5: "FR",
    6: "SAT",
  };

  const endDate = {
    1: "1231", // if term is odd, schedule ends on 31st of December
    2: "0531", // if term is even, schedule ends on 31st of May
    3: "0831", // if term is short, schedule ends on 31st of August
  };

  return `FREQ=WEEKLY;BYDAY=${
    days[day]
  };INTERVAL=1;UNTIL=${new Date().getFullYear()}${endDate[term]}T170000Z`;
};
