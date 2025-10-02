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

export interface KartleggingssporsmalsvarStatusResponseDTO {
  isKandidat: boolean;
  formResponse: KartleggingssporsmalsvarResponseDTO | null;
}

export interface KartleggingssporsmalsvarResponseDTO {
  uuid: string;
  fnr: string;
  kandidatId: string;
  formSnapshot: FormSnapshot;
  createdAt: Date;
}

export function isKandidat(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | undefined
): boolean {
  return kartleggingData?.status === KandidatStatus.KANDIDAT;
}

export function hasReceivedQuestions(
  kartleggingData: KartleggingssporsmalKandidatResponseDTO | undefined
): boolean {
  return kartleggingData?.varsletAt !== null;
}
