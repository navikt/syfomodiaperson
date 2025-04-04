import {
  createAktivitetskrav,
  expiredForhandsvarselVurdering,
  forhandsvarselVurdering,
  generateOppfolgingstilfelle,
} from "../../testDataUtils";
import { daysFromToday } from "../../testUtils";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";

export const aktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.NY
);
export const forhandsvarselAktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.FORHANDSVARSEL,
  [forhandsvarselVurdering]
);
export const expiredForhandsvarselAktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.FORHANDSVARSEL,
  [expiredForhandsvarselVurdering]
);

export const tilfelleStart = daysFromToday(-50);
export const tilfelleEnd = daysFromToday(50);
export const oppfolgingstilfelle = generateOppfolgingstilfelle(
  tilfelleStart,
  tilfelleEnd
);

export const buttonTexts = {
  [AktivitetskravStatus.AVVENT]: "Avvent",
  [AktivitetskravStatus.IKKE_AKTUELL]: "Ikke aktuell",
};

export const tabTexts = {
  [AktivitetskravStatus.UNNTAK]: "Sett unntak",
  [AktivitetskravStatus.OPPFYLT]: "Er i aktivitet",
  [AktivitetskravStatus.FORHANDSVARSEL]: "Send forhåndsvarsel",
  [AktivitetskravStatus.INNSTILLING_OM_STANS]: "Innstilling om stans",
};

export const enLangBeskrivelse = "Her er en beskrivelse" + "t".repeat(900);
export const enKortBeskrivelse = "Her er en beskrivelse" + "t".repeat(150);
