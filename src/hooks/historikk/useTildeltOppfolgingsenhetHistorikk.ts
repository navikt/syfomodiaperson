import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";
import { Enhet } from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
import { useTildeltOppfolgingsenhetHistorikkQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

export enum TildeltType {
  TILDELT_ANNEN_ENHET_AV_VEILEDER = "TILDELT_ANNEN_ENHET_AV_VEILEDER",
  TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_VEILEDER = "TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_VEILEDER",
  TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_SYSTEM = "TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_SYSTEM",
}

interface TildeltOppfolgingsenhetHistorikkDTO {
  createdAt: Date;
  veilederident: string;
  type: TildeltType;
}

export interface Tildelt extends TildeltOppfolgingsenhetHistorikkDTO {
  createdAt: Date;
  type: TildeltType.TILDELT_ANNEN_ENHET_AV_VEILEDER;
  veilederident: string;
  enhet: Enhet;
}

export interface TildeltTilbake extends TildeltOppfolgingsenhetHistorikkDTO {
  createdAt: Date;
  type: TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_VEILEDER;
  veilederident: string;
}

export interface TildeltTilbakeAvSystem
  extends TildeltOppfolgingsenhetHistorikkDTO {
  createdAt: Date;
  type: TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_SYSTEM;
  veilederident: string;
}

export type TildeltHistorikkDTO =
  | Tildelt
  | TildeltTilbake
  | TildeltTilbakeAvSystem;

function getTextForHistorikk(tildeltHistorikk: TildeltHistorikkDTO): string {
  switch (tildeltHistorikk.type) {
    case TildeltType.TILDELT_ANNEN_ENHET_AV_VEILEDER:
      return `${tildeltHistorikk.veilederident} tildelte sykmeldt til ${tildeltHistorikk.enhet.navn} (${tildeltHistorikk.enhet.enhetId})`;
    case TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_VEILEDER:
      return `${tildeltHistorikk.veilederident} tildelte sykmeldt tilbake til geografisk enhet`;
    case TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_SYSTEM:
      return `Systemet tildelte sykmeldt tilbake til geografisk enhet`;
  }
}

function createHistorikkEventsFromTildelHistorikk(
  tildelHistorikk: TildeltHistorikkDTO[]
): HistorikkEvent[] {
  return tildelHistorikk.map((entry: TildeltHistorikkDTO) => {
    return {
      opprettetAv: entry.veilederident,
      tekst: getTextForHistorikk(entry),
      tidspunkt: entry.createdAt,
      kilde: "TILDELT_OPPFOLGINGSENHET",
    };
  });
}

export function useTildeltOppfolgingsenhetHistorikk(): HistorikkHook {
  const {
    data: tildeltOppfolgingsenhetHistorikk,
    isLoading,
    isError,
  } = useTildeltOppfolgingsenhetHistorikkQuery();

  const events = createHistorikkEventsFromTildelHistorikk(
    tildeltOppfolgingsenhetHistorikk ?? []
  );

  return {
    isLoading,
    isError,
    events,
  };
}
