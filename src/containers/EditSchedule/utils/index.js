import { getCourses } from "services/api"

const mapScheduleItemsByName = (scheduleArray) => {
    let result = {}
    scheduleArray.forEach(sched => {
        const key = `${sched.course_name}-${sched.name}`;
        result[key] = sched;
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
            const classKey = `${course.name}-${classItem.name}`;
            if (classKey in scheduleMap && !(classKey in added)) {
                added[classKey] = 1;
                // add Matched class schedule to result
                result.push({ ...classItem, credit: course.credit, parentName: course.name, term: course.term, name: classItem.name })
                // removing Matched class schedule from savedSchedule, so it became remainingSchedule
                savedSchedule.schedule_items = savedSchedule.schedule_items.filter(sched => (sched.name !== classItem.name && sched.course_name !== course.name))
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