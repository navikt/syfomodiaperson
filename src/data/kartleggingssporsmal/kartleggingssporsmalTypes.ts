import { FormSnapshot } from "@/data/skjemasvar/types/SkjemasvarTypes";

export interface KartleggingssporsmalKandidatResponseDTO {
  uuid: string;
  createdAt: Date;
  personident: string;
  status: KandidatStatus;
  varsletAt: Date;
}

export enum KandidatStatus {
  KANDIDAT = "KANDIDAT",
  IKKE_KANDIDAT = "IKKE_KANDIDAT",
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
  return kartleggingData?.status === KandidatStatus.KANDIDAT;
}
