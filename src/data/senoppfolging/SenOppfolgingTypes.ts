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
