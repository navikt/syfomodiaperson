import { useAppSelector } from "./hooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";

export const useLedere = (): {
  currentLedere: NarmesteLederRelasjonDTO[];
  formerLedere: NarmesteLederRelasjonDTO[];
  henterLedere: boolean;
  hentingLedereFeilet: boolean;
  getCurrentNarmesteLeder: (
    virksomhetsnummer: string
  ) => NarmesteLederRelasjonDTO | undefined;
  hentingLedereForsokt: boolean;
} => {
  const {
    formerLedere,
    henter,
    currentLedere,
    hentingForsokt: hentingLedereForsokt,
    hentingFeilet: hentingLedereFeilet,
  } = useAppSelector((state) => state.ledere);

  const getCurrentNarmesteLeder = (
    virksomhetsnummer: string
  ): NarmesteLederRelasjonDTO | undefined => {
    return currentLedere.find(
      (leder) => leder.virksomhetsnummer === virksomhetsnummer
    );
  };

  return {
    getCurrentNarmesteLeder,
    currentLedere,
    formerLedere,
    henterLedere: henter,
    hentingLedereForsokt,
    hentingLedereFeilet,
  };
};
