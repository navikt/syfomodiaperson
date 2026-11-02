import dayjs, { Dayjs } from "dayjs";
import nb from "dayjs/locale/nb";
import nn from "dayjs/locale/nn";
import { firstLetterToUpperCase } from "./stringUtils";
import { Malform } from "../context/malform/MalformContext";

export type DateInput = Date | Dayjs | string | number;

type OptionalDateInput = DateInput | null | undefined;

const DATE_RANGE_SEPARATOR = "–";
const SHORT_DATE_FORMAT = "DD.MM.YYYY";
const ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

export const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function getLocale(languageForm?: Malform) {
  return languageForm === Malform.NYNORSK ? nn : nb;
}

function isValidCalendarDate(date: string): boolean {
  const match = ISO_DATE_PREFIX.exec(date);
  if (!match) {
    return true;
  }
  const [, year, month, day] = match.map(Number);
  const calendarDate = new Date(year, month - 1, day);
  return (
    calendarDate.getFullYear() === year &&
    calendarDate.getMonth() === month - 1 &&
    calendarDate.getDate() === day
  );
}

function parseDate(date: OptionalDateInput): Dayjs | undefined {
  if (date === null || date === undefined || date === "") {
    return undefined;
  }
  if (typeof date === "string" && !isValidCalendarDate(date)) {
    return undefined;
  }
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed : undefined;
}

function formatDate(
  date: OptionalDateInput,
  format: string,
  languageForm?: Malform,
): string | undefined {
  return parseDate(date)?.locale(getLocale(languageForm)).format(format);
}

export function formatDateWithoutYear(date: OptionalDateInput): string | null {
  return formatDate(date, "D. MMMM") ?? null;
}

export function formatDateWithYear(
  date: OptionalDateInput,
): string | undefined {
  return formatDate(date, "D. MMMM YYYY");
}

export function formatDateRangeWithYear(
  from: OptionalDateInput,
  to: OptionalDateInput,
): string {
  const parsedFrom = parseDate(from);
  const parsedTo = parseDate(to);
  if (!parsedFrom || !parsedTo) {
    return "";
  }
  const toText = formatDateWithYear(parsedTo);
  if (parsedFrom.isSame(parsedTo, "month")) {
    return `${parsedFrom.date()}. ${DATE_RANGE_SEPARATOR} ${toText}`;
  }
  if (parsedFrom.isSame(parsedTo, "year")) {
    return `${formatDateWithoutYear(parsedFrom)} ${DATE_RANGE_SEPARATOR} ${toText}`;
  }
  return `${formatDateWithYear(parsedFrom)} ${DATE_RANGE_SEPARATOR} ${toText}`;
}

export function getMonthName(date: DateInput): string {
  return formatDate(date, "MMMM") ?? "";
}

export function formatTime(date: OptionalDateInput): string | null {
  return formatDate(date, "HH.mm") ?? null;
}

export function showTimeIncludingSeconds(
  date: OptionalDateInput,
): string | null {
  return formatDate(date, "HH:mm:ss") ?? null;
}

export function formatShortDate(date: OptionalDateInput): string {
  return formatDate(date, SHORT_DATE_FORMAT) ?? "";
}

export function formatReadableDate(
  date: OptionalDateInput,
): string | undefined {
  return formatDateWithYear(date);
}

export function formatDateWithMonthName(date: OptionalDateInput): string {
  return formatDateWithYear(date) ?? "";
}

export function formatDateWithWeekdayAndMonthName(
  date: OptionalDateInput,
  languageForm?: Malform,
): string {
  const text = formatDate(date, "dddd D. MMMM YYYY", languageForm);
  return text ? firstLetterToUpperCase(text) : "";
}

export function formatDateTimeWithComma(date: OptionalDateInput): string {
  return formatDate(date, "D. MMMM YYYY, [kl.] HH.mm") ?? "";
}

export function formatDateTime(date: OptionalDateInput): string {
  return formatDate(date, "D. MMMM YYYY [kl.] HH.mm") ?? "";
}

export function formatDateTimeWithWeekday(
  date: OptionalDateInput,
  languageForm?: Malform,
): string {
  const text = formatDate(date, "dddd D. MMMM YYYY [kl.] HH.mm", languageForm);
  return text ? firstLetterToUpperCase(text) : "";
}

export function formatNumericDate(date: OptionalDateInput): string {
  return formatDate(date, SHORT_DATE_FORMAT) ?? "";
}

export function formatNumericDateRange(
  from: OptionalDateInput,
  to: OptionalDateInput,
): string {
  return `${formatNumericDate(from)} - ${formatNumericDate(to)}`;
}

export function getCalendarDaysBetween(
  startDate: DateInput,
  endDate: DateInput,
): number {
  return dayjs(endDate)
    .startOf("day")
    .diff(dayjs(startDate).startOf("day"), "day");
}

export function getAbsoluteCalendarDaysBetween(
  startDate: DateInput,
  endDate: DateInput,
): number {
  return Math.abs(getCalendarDaysBetween(startDate, endDate));
}

export function isToday(date: OptionalDateInput): boolean {
  return parseDate(date)?.isSame(dayjs(), "day") ?? false;
}

export function isNotToday(date: OptionalDateInput): boolean {
  return !isToday(date);
}

export function toDate(date: OptionalDateInput): Date | undefined {
  return parseDate(date)?.toDate();
}

export function toDateOrInvalid(date: DateInput): Date {
  return parseDate(date)?.toDate() ?? new Date(NaN);
}

export function formatShortDateOrUndefined(
  date: OptionalDateInput,
): string | undefined {
  return formatDate(date, SHORT_DATE_FORMAT);
}

export function getDuration(from: DateInput, to: DateInput): number {
  return getCalendarDaysBetween(from, to) + 1;
}

export function getNonNegativeWholeMonthsBetween(
  date1: OptionalDateInput,
  date2: OptionalDateInput,
): number {
  const from = parseDate(date1);
  const to = parseDate(date2);
  if (!from || !to) {
    return 0;
  }
  const months = to.startOf("day").diff(from.startOf("day"), "month");
  return Math.max(months, 0);
}

export function addWeeks(date: DateInput, numberOfWeeks: number): Date {
  return dayjs(date).add(numberOfWeeks, "weeks").toDate();
}

export function addDays(date: DateInput, numberOfDays: number): Date {
  return dayjs(date).add(numberOfDays, "days").toDate();
}

export function toDateOnly(date: DateInput): Date {
  return dayjs(date).startOf("day").toDate();
}

export function getWeeksBetween(date1: DateInput, date2: DateInput): number {
  return Math.abs(dayjs(date1).diff(date2, "week"));
}

export function isExpired(deadline: Date | undefined): boolean {
  if (!deadline) {
    return false;
  }
  return dayjs(deadline).isBefore(dayjs(), "day");
}

export function daysFromToday(days: number): Date {
  return dayjs().add(days, "days").toDate();
}

export function weeksFromToday(weeks: number): Date {
  return dayjs().add(weeks, "weeks").toDate();
}
