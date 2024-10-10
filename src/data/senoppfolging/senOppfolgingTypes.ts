export interface SenOppfolgingFormResponseDTOV2 {
  uuid: string;
  personIdent: string;
  createdAt: Date;
  formType: string;
  questionResponses: QuestionResponseDTO[];
}

interface QuestionResponseDTO {
  questionType: string;
  questionText: string;
  answerType: string;
  answerText: string;
}

export interface SenOppfolgingKandidatResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  varselAt: Date | undefined;
  svar: SvarResponseDTO | undefined;
  status: SenOppfolgingStatus;
  vurderinger: SenOppfolgingVurderingResponseDTO[];
}

export interface SvarResponseDTO {
  svarAt: Date;
  onskerOppfolging: OnskerOppfolging;
}

export enum OnskerOppfolging {
  JA = "JA",
  NEI = "NEI",
}

export interface SenOppfolgingVurderingResponseDTO {
  uuid: string;
  createdAt: Date;
  veilederident: string;
  type: SenOppfolgingVurderingType;
  begrunnelse?: string;
}

export enum SenOppfolgingStatus {
  KANDIDAT = "KANDIDAT",
  FERDIGBEHANDLET = "FERDIGBEHANDLET",
}

export enum SenOppfolgingVurderingType {
  FERDIGBEHANDLET = "FERDIGBEHANDLET",
}

export interface SenOppfolgingVurderingRequestDTO {
  type: SenOppfolgingVurderingType;
  begrunnelse?: string;
}
