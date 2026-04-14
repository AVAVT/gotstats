export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  url?: string;
};

const pad = (value: number) => value.toString().padStart(2, "0");

const toLocalCalendarDateTime = (date: Date) => {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
};

const toUtcCalendarDateTime = (date: Date) => {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
};

const escapeIcsText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export const getNextYearJanFirstAt11Local = () => {
  const nextYear = new Date().getFullYear() + 1;
  return new Date(nextYear, 0, 1, 11, 0, 0, 0);
};

export const buildGoogleCalendarUrl = ({ title, start, end, description, url }: CalendarEvent) => {
  const details = url
    ? `${description ?? ""}<br><a href="${url}">${url}</a>`.trim()
    : (description ?? "Reminder: set an email notification at event time.");
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toLocalCalendarDateTime(start)}/${toLocalCalendarDateTime(end)}`,
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    details,
  });

  return `https://calendar.google.com/calendar/u/0/r/eventedit?${query.toString()}`;
};

export const buildIcsContent = ({ title, start, end, description, url }: CalendarEvent) => {
  const uid = `ogs-year-in-review-${start.getTime()}@gotstats`;
  const timestamp = toUtcCalendarDateTime(new Date());
  const summary = escapeIcsText(title);
  const body = escapeIcsText(description ?? "Your yearly OGS recap is available.");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//gotstats//YearInReview//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${toUtcCalendarDateTime(start)}`,
    `DTEND:${toUtcCalendarDateTime(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${body}`,
    ...(url ? [`URL:${url}`] : []),
    "BEGIN:VALARM",
    "ACTION:EMAIL",
    "TRIGGER:PT0M",
    "SUMMARY:Your OGS Year in Review is ready!",
    "DESCRIPTION:Open gotstats and check your yearly recap.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
};
