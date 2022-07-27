import {
  dayToColumn,
  generateStartingMonth,
  generateRecurrenceRule,
  getFirstDateOfNDayInAMonth,
} from "utils/date";

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
      const calendarDate = getFirstDateOfNDayInAMonth(
        dayOfTheWeek,
        generateStartingMonth(term) - 1,
        new Date().getFullYear(),
      );

      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth() + 1;
      const day = calendarDate.getDate();

      const [startHour, startMinute] = item.start.split(".").map((item) => {
        return parseInt(item, 10);
      });
      const [endHour, endMinute] = item.end.split(".").map((item) => {
        return parseInt(item, 10);
      });

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
