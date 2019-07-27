export function isScheduleConflict(schedules, schedule) {
  return !!schedules
    .filter(other => other.parentName !== schedule.parentName)
    .find(other => {
      for (const item1 of schedule.schedule_items) {
        const start = parseFloat(item1.start);
        const end = parseFloat(item1.end);

        for (const item2 of other.schedule_items) {
          const anotherStart = parseFloat(item2.start);
          const anotherEnd = parseFloat(item2.end);

          const valid = end <= anotherStart || anotherEnd <= start;
          if (!valid && item1.day === item2.day) {
            return true;
          }
        }
      }

      return false;
    });
}
