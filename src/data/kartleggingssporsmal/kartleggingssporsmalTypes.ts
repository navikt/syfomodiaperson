import { FormSnapshot } from "@/data/skjemasvar/types/SkjemasvarTypes";

export interface KartleggingssporsmalKandidatResponseDTO {
  kandidatUuid: string;
  personident: string;
  status: KandidatStatus;
  varsletAt: Date;
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

export interface KartleggingssporsmalSvarStatusResponseDTO {
  formResponse: KartleggingssporsmalSvarResponseDTO | null;
}

export interface KartleggingssporsmalSvarResponseDTO {
  uuid: string;
  fnr: string;
  kandidatId: string;
  formSnapshot: FormSnapshot;
  createdAt: Date;
}

export function isKandidat(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | null | undefined
): boolean {
  return !!kartleggingData;
}
