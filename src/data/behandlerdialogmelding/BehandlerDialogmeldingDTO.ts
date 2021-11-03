import { capitalizeWord } from "../../utils/stringUtils";

export interface BehandlerDialogmeldingDTO {
  type: BehandlerType;
  behandlerRef: string;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  adresse?: string;
  orgnummer?: string;
  kontor?: string;
  postnummer?: string;
  poststed?: string;
  telefon?: string;
}

export const behandlerOneliner = (
  behandler: BehandlerDialogmeldingDTO
): string => {
  const name = [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
  const typeAndName = `${capitalizeWord(behandler.type)}: ${name}`;
  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  return [typeAndName, office, phone].filter(Boolean).join(", ");
};

export enum BehandlerType {
  FASTLEGE = "FASTLEGE",
}
