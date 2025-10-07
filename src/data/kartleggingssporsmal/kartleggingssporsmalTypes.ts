import { FormSnapshot } from "@/data/motebehov/types/motebehovTypes";

export interface KartleggingssporsmalKandidatResponseDTO {
  uuid: string;
  createdAt: Date;
  personident: string;
  status: KandidatStatus;
  varsletAt: Date | null;
}

export enum KandidatStatus {
  KANDIDAT = "KANDIDAT",
  IKKE_KANDIDAT = "IKKE_KANDIDAT",
}

export interface KartleggingssporsmalSvarStatusResponseDTO {
  isKandidat: boolean;
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
  return kartleggingData?.status === KandidatStatus.KANDIDAT;
}

export function hasReceivedQuestions(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | null | undefined
): boolean {
  return kartleggingData?.varsletAt !== null;
}
