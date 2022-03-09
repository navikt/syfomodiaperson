import { BehandlerDTO } from "@/data/sykmelding/types/BehandlerDTO";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { capitalizeWord } from "@/utils/stringUtils";

export const behandlerNavn = (
  behandler: BehandlerDTO | BehandlerDialogmeldingDTO
): string => {
  if (behandler.mellomnavn) {
    return `${behandler.fornavn} ${behandler.mellomnavn} ${behandler.etternavn}`;
  }

  return `${behandler.fornavn} ${behandler.etternavn}`;
};

export const behandlerDeltakerTekst = (
  pretekst: string,
  behandler: DialogmotedeltakerBehandlerDTO
) => {
  return `${pretekst} ${capitalizeWord(
    behandler.behandlerType.toLowerCase()
  )} ${behandler.behandlerNavn}`;
};

export const behandlerDeltokTekst = (
  behandler: DialogmotedeltakerBehandlerDTO,
  deltatt: boolean | undefined
): string =>
  `${behandlerDeltakerTekst("Behandler:", behandler)}${
    deltatt === false ? ", deltok ikke" : ""
  }`;
