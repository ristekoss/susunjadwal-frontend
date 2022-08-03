function checkIfTwoScheduleConflict(schedule1, schedule2) {
  for (const item1 of schedule1.schedule_items) {
    const start = parseFloat(item1.start);
    const end = parseFloat(item1.end);

    for (const item2 of schedule2.schedule_items) {
      const anotherStart = parseFloat(item2.start);
      const anotherEnd = parseFloat(item2.end);

      const valid = end <= anotherStart || anotherEnd <= start;
      if (!valid && item1.day === item2.day) {
        return true;
      }
    }
  }
  return false;
}

export function isScheduleConflict(schedules, schedule) {
  return !!schedules
    .filter((other) => other.parentName !== schedule.parentName)
    .find((other) => {
      return checkIfTwoScheduleConflict(schedule, other);
    });
}

function scheduleName(schedule) {
  return String(schedule.name).includes(schedule.parentName) ||
    !schedule.parentName
    ? schedule.name
    : `${schedule.parentName} - ${schedule.name}`;
}

export function listScheduleConflicts(schedules) {
  const listConflicts = [];
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (checkIfTwoScheduleConflict(schedules[i], schedules[j])) {
        listConflicts.push([
          scheduleName(schedules[i]),
          scheduleName(schedules[j]),
        ]);
      }
    }
  }

  return listConflicts;
}
