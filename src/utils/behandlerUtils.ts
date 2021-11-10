import { BehandlerDTO } from "@/data/sykmelding/types/BehandlerDTO";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

export const behandlerNavn = (
  behandler: BehandlerDTO | BehandlerDialogmeldingDTO
): string => {
  if (behandler.mellomnavn) {
    return `${behandler.fornavn} ${behandler.mellomnavn} ${behandler.etternavn}`;
  }

  return `${behandler.fornavn} ${behandler.etternavn}`;
};
