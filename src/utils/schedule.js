const getFormattedSchedule = (schedule) => {
  const formattedSchedule = {}
  let totalCredits = 0

  schedule.schedule_items.forEach(({name, start, end, day, room, course_name, sks, lecturer}) => {
    const scheduleKey =  `${course_name}-${name}`;
    const formatedName = (String(name).includes(course_name) || !course_name)
      ? name
      : `${course_name} - ${name}`

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
        sks: sks
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
  });

  return [formattedSchedule, totalCredits]
};

export default getFormattedSchedule;

export const groupScheduleByPeriod = (schedules) => {
  const groupedSchedule = {}
  const periods = []

  schedules.forEach((schedule, id) => {
    const period = schedule.period

    if (!periods.includes(period)) {
      periods.push(period)
      groupedSchedule[period] = [schedule]
    } else {
      groupedSchedule[period] = [schedule, ...groupedSchedule[period]]
    }
  })

  return [groupedSchedule, periods]
}


export const convertPeriodToLiteral = (period) => {
  const [year, term] = period.split('-')

  const SEMESTERS = {
    '1': 'Ganjil',
    '2': 'Genap',
    '3': 'Pendek',
  }

  return `Semester ${SEMESTERS[term]} ${year}/${Number(year) + 1}`
}
