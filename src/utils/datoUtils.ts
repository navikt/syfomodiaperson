import dayjs, { Dayjs } from "dayjs";
import nb from "dayjs/locale/nb";
import nn from "dayjs/locale/nn";
import { firstLetterToUpperCase } from "./stringUtils";
import { Malform } from "../context/malform/MalformContext";

export type Dato = Date | Dayjs | string | number;

type ValgfriDato = Dato | null | undefined;

const SKILLETEGN_PERIODE = "–";
const KORT_DATOFORMAT = "DD.MM.YYYY";
const ISO_DATO_PREFIKS = /^(\d{4})-(\d{2})-(\d{2})/;

export const ANTALL_MS_DAG = 1000 * 60 * 60 * 24;

function getLocale(malform?: Malform) {
  return malform === Malform.NYNORSK ? nn : nb;
}

function erGyldigKalenderdato(dato: string): boolean {
  const match = ISO_DATO_PREFIKS.exec(dato);
  if (!match) {
    return true;
  }
  const [, ar, maned, dag] = match.map(Number);
  const kalenderdato = new Date(ar, maned - 1, dag);
  return (
    kalenderdato.getFullYear() === ar &&
    kalenderdato.getMonth() === maned - 1 &&
    kalenderdato.getDate() === dag
  );
}

function parseDato(dato: ValgfriDato): Dayjs | undefined {
  if (dato === null || dato === undefined || dato === "") {
    return undefined;
  }
  if (typeof dato === "string" && !erGyldigKalenderdato(dato)) {
    return undefined;
  }
  const parsed = dayjs(dato);
  return parsed.isValid() ? parsed : undefined;
}

function formater(
  dato: ValgfriDato,
  format: string,
  malform?: Malform,
): string | undefined {
  return parseDato(dato)?.locale(getLocale(malform)).format(format);
}

export function tilLesbarDatoUtenArstall(dato: ValgfriDato): string | null {
  return formater(dato, "D. MMMM") ?? null;
}

export function tilLesbarDatoMedArstall(dato: ValgfriDato): string | undefined {
  return formater(dato, "D. MMMM YYYY");
}

export function tilLesbarPeriodeMedArstall(
  fom: ValgfriDato,
  tom: ValgfriDato,
): string {
  const parsedFom = parseDato(fom);
  const parsedTom = parseDato(tom);
  if (!parsedFom || !parsedTom) {
    return "";
  }
  const tomTekst = tilLesbarDatoMedArstall(parsedTom);
  if (parsedFom.isSame(parsedTom, "month")) {
    return `${parsedFom.date()}. ${SKILLETEGN_PERIODE} ${tomTekst}`;
  }
  if (parsedFom.isSame(parsedTom, "year")) {
    return `${tilLesbarDatoUtenArstall(parsedFom)} ${SKILLETEGN_PERIODE} ${tomTekst}`;
  }
  return `${tilLesbarDatoMedArstall(parsedFom)} ${SKILLETEGN_PERIODE} ${tomTekst}`;
}

export function getManedText(dato: Dato): string {
  return formater(dato, "MMMM") ?? "";
}

export function visKlokkeslett(dato: ValgfriDato): string | null {
  return formater(dato, "HH.mm") ?? null;
}

export function showTimeIncludingSeconds(dato: ValgfriDato): string | null {
  return formater(dato, "HH:mm:ss") ?? null;
}

export function restdatoTildato(restdato: ValgfriDato): string {
  return formater(restdato, KORT_DATOFORMAT) ?? "";
}

export function restdatoTilLesbarDato(
  restdato: ValgfriDato,
): string | undefined {
  return tilLesbarDatoMedArstall(restdato);
}

export function tilDatoMedManedNavn(dato: ValgfriDato): string {
  return tilLesbarDatoMedArstall(dato) ?? "";
}

export function tilDatoMedUkedagOgManedNavn(
  dato: ValgfriDato,
  malform?: Malform,
): string {
  const tekst = formater(dato, "dddd D. MMMM YYYY", malform);
  return tekst ? firstLetterToUpperCase(tekst) : "";
}

export function getDatoKomponenter(dato: ValgfriDato, malform?: Malform) {
  const parsed = parseDato(dato)?.locale(getLocale(malform));
  return {
    ukeDag: parsed ? firstLetterToUpperCase(parsed.format("dddd")) : "",
    dag: parsed ? parsed.date() : NaN,
    maaned: parsed ? parsed.format("MMMM") : "",
    aar: parsed ? parsed.year() : NaN,
  };
}

export function tilDatoMedManedNavnOgKlokkeslettWithComma(
  dato: ValgfriDato,
): string {
  return formater(dato, "D. MMMM YYYY, [kl.] HH.mm") ?? "";
}

export function tilDatoMedManedNavnOgKlokkeslett(dato: ValgfriDato): string {
  return formater(dato, "D. MMMM YYYY [kl.] HH.mm") ?? "";
}

export function tilDatoMedUkedagOgManedNavnOgKlokkeslett(
  dato: ValgfriDato,
  malform?: Malform,
): string {
  const tekst = formater(dato, "dddd D. MMMM YYYY [kl.] HH.mm", malform);
  return tekst ? firstLetterToUpperCase(tekst) : "";
}

export function tilLesbarDatoMedArUtenManedNavn(dato: ValgfriDato): string {
  return formater(dato, KORT_DATOFORMAT) ?? "";
}

export function tilLesbarPeriodeMedArUtenManednavn(
  fom: ValgfriDato,
  tom: ValgfriDato,
): string {
  return `${tilLesbarDatoMedArUtenManedNavn(fom)} - ${tilLesbarDatoMedArUtenManedNavn(tom)}`;
}

function kalenderdagerMellom(startDato: Dato, sluttDato: Dato): number {
  return dayjs(sluttDato)
    .startOf("day")
    .diff(dayjs(startDato).startOf("day"), "day");
}

export function dagerMellomDatoer(startDato: Dato, sluttDato: Dato): number {
  return Math.abs(kalenderdagerMellom(startDato, sluttDato));
}

export function dagerMellomDatoerUtenAbs(
  startDato: Dato,
  sluttDato: Dato,
): number {
  return kalenderdagerMellom(startDato, sluttDato);
}

export function erIdag(dato: ValgfriDato): boolean {
  return parseDato(dato)?.isSame(dayjs(), "day") ?? false;
}

export function erIkkeIdag(dato: ValgfriDato): boolean {
  return !erIdag(dato);
}

export function toDate(dato: ValgfriDato): Date | undefined {
  return parseDato(dato)?.toDate();
}

export function toDateWithoutNullCheck(dato: Dato): Date {
  return parseDato(dato)?.toDate() ?? new Date(NaN);
}

export function toDatePrettyPrint(dato: ValgfriDato): string | undefined {
  return formater(dato, KORT_DATOFORMAT);
}

export function getDuration(from: Dato, to: Dato): number {
  return kalenderdagerMellom(from, to) + 1;
}

export function manederMellomDatoer(d1: ValgfriDato, d2: ValgfriDato): number {
  const fra = parseDato(d1);
  const til = parseDato(d2);
  if (!fra || !til) {
    return 0;
  }
  const maneder = til.startOf("day").diff(fra.startOf("day"), "month");
  return Math.max(maneder, 0);
}

export function addWeeks(date: Dato, numberOfWeeks: number): Date {
  return dayjs(date).add(numberOfWeeks, "weeks").toDate();
}

export function addDays(date: Dato, numberOfDays: number): Date {
  return dayjs(date).add(numberOfDays, "days").toDate();
}

export function toDateOnly(date: Dato): Date {
  return dayjs(date).startOf("day").toDate();
}

export function getWeeksBetween(date1: Dato, date2: Dato): number {
  return Math.abs(dayjs(date1).diff(date2, "week"));
}

export function isExpiredForhandsvarsel(svarfrist: Date | undefined): boolean {
  if (!svarfrist) {
    return false;
  }
  return dayjs(svarfrist).isBefore(dayjs(), "day");
}

export function daysFromToday(days: number): Date {
  return dayjs().add(days, "days").toDate();
}

export function weeksFromToday(weeks: number): Date {
  return dayjs().add(weeks, "weeks").toDate();
}
