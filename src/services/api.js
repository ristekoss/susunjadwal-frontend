import axios from "axios";
import config from "config";

let instance = axios.create({
  baseURL: config.API_BASE_URL,
});

export function setupAxiosInstance(token) {
  instance = axios.create({
    baseURL: config.API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getCourses(majorId) {
  return instance.get(`/majors/${majorId}/courses`);
}

export function getCoursesByKd(kd_org) {
  return instance.get(`/majors/${kd_org}/courses_by_kd`);
}

export function postSaveSchedule(userId, scheduleItems) {
  return instance.post(`/users/${userId}/user_schedule`, {
    schedule_items: scheduleItems,
  });
}

export function getSchedule(scheduleId) {
  return instance.get(`/user_schedules/${scheduleId}`);
}

export function getSchedules(userId) {
  return instance.get(`/users/${userId}/user_schedules`);
}

export function postAuthTicket(ticket, serviceUrl) {
  return instance.post(`/auth/v2/`, {
    ticket,
    service_url: serviceUrl,
  });
}

export function postRenameSchedule(userId, scheduleId, name) {
  return instance.post(
    `/users/${userId}/user_schedules/${scheduleId}/change_name`,
    { name },
  );
}

export function deleteSchedule(userId, scheduleId) {
  return instance.delete(`/users/${userId}/user_schedules/${scheduleId}`);
}

export const putUpdateSchedule = (userId, scheduleId, scheduleItems) =>
  instance.put(`/users/${userId}/user_schedules/${scheduleId}`, {
    schedule_items: scheduleItems,
  });

export const postBetaTesterData = async function (data) {
  await axios.post(
    `https://api.airtable.com/v0/${process.env.REACT_APP_BETA_AIRTABLE_BASE_ID}/${process.env.REACT_APP_BETA_AIRTABLE_TABLE_NAME}`,
    { records: [{ fields: data }] },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BETA_AIRTABLE_API_KEY}`,
      },
    },
  );
};

export const postScrapeSchedule = async ({ username, password }) =>
  await instance.post("/scrape-schedule", {
    username: username,
    password: password,
  });

export const postSsoCompletionData = async ({ completionId, npm, kdOrg }) =>
  await instance.post("/auth/completion/", {
    completion_id: completionId,
    npm: npm,
    kd_org: kdOrg,
  });
export const getContributorsOldSunjad = async () =>
  await axios.get(
    "https://api.github.com/repos/ristekoss/susunjadwal/contributors",
  );

export const getContributorsFrontend = async () =>
  await axios.get(
    "https://api.github.com/repos/ristekoss/susunjadwal-frontend/contributors",
  );
export const getContributorsBackend = async () =>
  await axios.get(
    "https://api.github.com/repos/ristekoss/susunjadwal-backend/contributors",
  );

export const getAnnouncement = async () =>
  await axios.get(
    `https://api.airtable.com/v0/${process.env.REACT_APP_BETA_AIRTABLE_BASE_ID}/${process.env.REACT_APP_AIRTABLE_NOTIFICATION_CONFIG_TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BETA_AIRTABLE_API_KEY}`,
      },
    },
  );

export const createReview = async (userId, rating, comment) =>
  await instance.post(`/review/${userId}`, {
    rating: rating,
    comment: comment,
  });

export const loginAdmin = async (username, password) =>
  await instance.post(`/admin/login`, {
    username: username,
    password: password,
  });

export const getReviews = async (token, page, per_page) =>
  await instance.get(`/admin/reviews/list?page=${page}&per_page=${per_page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getReviewOverview = async (token) =>
  await instance.get(`/admin/reviews-overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateReviewStatus = async (token, reviewId, status) =>
  await instance.patch(
    `/admin/review/status/${reviewId}`,
    {
      reviewed: status,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
