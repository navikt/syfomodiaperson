import { KartleggingssporsmalFormSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";

export interface KartleggingssporsmalKandidatResponseDTO {
  kandidatUuid: string;
  personident: string;
  varsletAt: Date | null;
  svarAt: Date | null;
  status: KandidatStatus;
  statusAt: Date;
  vurdering: KartleggingssporsmalKandidatVurderingResponseDTO | null;
  createdAt: Date;
}

export interface KartleggingssporsmalKandidatVurderingResponseDTO {
  vurdertAt: Date;
  vurdertBy: string;
  vurderingAlternativ?: VurderingAlternativ;
}

export interface KartleggingssporsmalKandidatVurderingRequestDTO {
  kandidatUuid: string;
  vurderingAlternativ: VurderingAlternativ;
}

export enum KandidatStatus {
  KANDIDAT = "KANDIDAT",
  SVAR_MOTTATT = "SVAR_MOTTATT",
  FERDIGBEHANDLET = "FERDIGBEHANDLET",
}

export interface KartleggingssporsmalSvarResponseDTO {
  uuid: string;
  fnr: string;
  kandidatId: string;
  formSnapshot: KartleggingssporsmalFormSnapshot;
  createdAt: Date;
}

/*
 * Det vil finnes kandidater i prod som ikke ble varslet ettersom de ble kandidater før vi startet pilotering.
 * Dermed vil noen kandidater ha status KANDIDAT uten varsletAt, og det burde ikke vises til veileder at disse har fått spørsmålene når de ikke har det.
 */
export function hasMottattKartleggingssporsmal(
  kartleggingssporsmalKandidat: KartleggingssporsmalKandidatResponseDTO
): boolean {
  return kartleggingssporsmalKandidat.varsletAt !== null;
}

export function hasAnsweredKartleggingssporsmal(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | null | undefined
): boolean {
  return (
    kartleggingData?.status === KandidatStatus.SVAR_MOTTATT ||
    kartleggingData?.status === KandidatStatus.FERDIGBEHANDLET
  );
}
