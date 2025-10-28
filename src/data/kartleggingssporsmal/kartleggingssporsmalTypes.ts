import { KartleggingssporsmalFormSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

export interface KartleggingssporsmalKandidatResponseDTO {
  kandidatUuid: string;
  personident: string;
  varsletAt: Date;
  svarAt: Date | null;
  status: KandidatStatus;
  statusAt: Date;
  vurdering: KartleggingssporsmalKandidatVurderingResponseDTO | null;
}

export interface KartleggingssporsmalKandidatVurderingResponseDTO {
  vurdertAt: Date;
  vurdertBy: string;
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

export function isKandidat(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | null | undefined
): boolean {
  return !!kartleggingData;
}
