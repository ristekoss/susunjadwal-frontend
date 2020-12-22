import { getCourses } from "services/api"

const mapScheduleItemsByName = (scheduleArray) => {
    let result = {}
    scheduleArray.forEach(sched => {
        result[sched.name] = sched;
    })
    return result;
}

const formatScheduleFromCourse = (courses, schedule) => {
    let result = [];
    let added = {};
    let savedSchedule = schedule;
    let { schedule_items } = schedule;
    const scheduleMap = mapScheduleItemsByName(schedule_items);
    const courseList = courses.courses;
    courseList.forEach(course => {
        const { classes } = course;
        classes.forEach(classItem => {
            if (classItem.name in scheduleMap && !(classItem.name in added)) {
                added[classItem.name] = 1;
                result.push({ ...classItem, credit: course.credit, parentName: course.name, term: course.term, name: classItem.name })
                savedSchedule.schedule_items = savedSchedule.schedule_items.filter(sched => sched.name !== classItem.name)
            }
        })
    })
    return [result, savedSchedule];
}


export const generateScheduledCourseListFromSchedule = async (majorId, schedule) => {
    const { data: courses } = await getCourses(majorId);
    let [formattedSchedule, remainingSchedule] = formatScheduleFromCourse(courses, schedule);
    remainingSchedule.schedule_items.forEach(sched => {
        formattedSchedule.push({ parentName: `__agenda-${sched.name}`, term: 0, credit: 0, name: sched.name, schedule_items: [sched] })
    })
    return formattedSchedule;
}