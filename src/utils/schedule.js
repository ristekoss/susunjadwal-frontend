import {
  dayToColumn,
  generateStartingMonth,
  generateRecurrenceRule,
  getFirstDateOfNthDayInAMonth,
} from "utils/date";

// Convert "HH:MM" or "HH.MM" time string to total minutes since midnight (based on SLCM response)
export const timeToMinutes = (display) => {
  if (display == null) return 0;
  const parts = String(display).split(/[:.]/);
  const hour = parseInt(parts[0], 10) || 0;
  const minute = parseInt(parts[1], 10) || 0;
  return hour * 60 + minute;
};

const getFormattedSchedule = (schedule) => {
  const formattedSchedule = {};
  let totalCredits = 0;

  if (!schedule.schedule_items) {
    return [formattedSchedule, totalCredits];
  }

  schedule.schedule_items.forEach(
    ({ name, start, end, day, room, course_name, sks, lecturer }) => {
      const scheduleKey = `${course_name}-${name}`;
      const formatedName =
        String(name).includes(course_name) || !course_name
          ? name
          : `${course_name} - ${name}`;

      if (!(scheduleKey in formattedSchedule)) {
        formattedSchedule[scheduleKey] = {
          name: formatedName,
          time: [
            {
              start: start,
              end: end,
              day: day,
              room: room,
            },
          ],
          lecturer: lecturer,
          sks: sks,
        };

        totalCredits += sks;
      } else {
        formattedSchedule[scheduleKey].time.push({
          start: start,
          end: end,
          day: day,
          room: room,
        });
      }
    },
  );

  return [formattedSchedule, totalCredits];
};

export default getFormattedSchedule;

export const parseFormattedScheduleToEvent = (schedule) => {
  const [formattedSchedule] = getFormattedSchedule(schedule);
  const classes = [];

  Object.keys(formattedSchedule).forEach((subject) => {
    formattedSchedule[subject].time.forEach((item) => {
      const term = schedule.period.split("-").pop();
      const dayOfTheWeek = dayToColumn(item.day);
      const calendarDate = getFirstDateOfNthDayInAMonth(
        dayOfTheWeek,
        generateStartingMonth(term) - 1,
        new Date().getFullYear(),
      );

      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth() + 1;
      const day = calendarDate.getDate();

      const [startHour, startMinute] = [
        Math.floor(timeToMinutes(item.start) / 60),
        timeToMinutes(item.start) % 60,
      ];
      const [endHour, endMinute] = [
        Math.floor(timeToMinutes(item.end) / 60),
        timeToMinutes(item.end) % 60,
      ];

      const data = {
        start: [year, month, day, startHour, startMinute],
        end: [year, month, day, endHour, endMinute],
        title: formattedSchedule[subject].name,
        location: item.room,
        recurrenceRule: generateRecurrenceRule(dayOfTheWeek, term),
      };

      classes.push(data);
    });
  });

  return classes;
};

export const groupScheduleByPeriod = (schedules) => {
  const groupedSchedule = {};
  const periods = [];

  schedules.forEach((schedule) => {
    const period = schedule.period;

    if (!periods.includes(period)) {
      periods.push(period);
      groupedSchedule[period] = [schedule];
    } else {
      groupedSchedule[period] = [schedule, ...groupedSchedule[period]];
    }
  });

  return [groupedSchedule, periods];
};

export const convertPeriodToLiteral = (period) => {
  const [year, term] = period.split("-");

  const SEMESTERS = {
    1: "Ganjil",
    2: "Genap",
    3: "Pendek",
  };

  return `Semester ${SEMESTERS[term]} ${year}/${Number(year) + 1}`;
};
