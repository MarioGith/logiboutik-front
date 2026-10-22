// Dates are stored in UTC: always show them in the user's own time zone.
export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "";

export const capitalize = (text) =>
  text ? text[0].toUpperCase() + text.slice(1) : "";

export const formatPrice = (value) => `${Number(value).toFixed(2)} €`;

// Midnight (local time) of the day after `date`.
export const nextDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + 1);
  return day;
};

// Midnight (local time) of `date`.
export const startOfDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};
