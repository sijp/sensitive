export const PROFESSIONALS_DB_URL =
  process.env.PROFESSIONALS_DB_URL || "http://localhost:5000";
export const PROFESSIONALS_DB_TYPES = ["trainers"];
export const PROFESSIONALS_DB_COLUMNS = [
  "id",
  "name",
  "facebookPage",
  "phone",
  "web",
  "email",
  "tags"
];
export const PROFESSIONALS_DB_CACHE_VALIDITY = 5 * 60; // 5 minutes
