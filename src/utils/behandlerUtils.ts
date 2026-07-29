import { SykmeldingBehandlerDTO } from "@/data/sykmelding/types/SykmeldingBehandlerDTO";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";

export const behandlerNavn = (
  behandler: SykmeldingBehandlerDTO | BehandlerDTO,
): string => {
  return [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
};

export const behandlerDisplayText = (behandler: BehandlerDTO): string => {
  const name = behandlerNavn(behandler);
  const type = !!behandler.type ? `${capitalizeWord(behandler.type)}:` : "";
  const typeAndName = `${type} ${name}`.trim();

  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const address = !!behandler.adresse ? capitalizeWord(behandler.adresse) : "";
  const postnr = !!behandler.postnummer ? behandler.postnummer : "";
  const poststed = !!behandler.poststed
    ? capitalizeWord(behandler.poststed)
    : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  const postadresse = [postnr, poststed].filter(Boolean).join(" ");
  const detaljer = [address, postadresse, phone].filter(Boolean).join(", ");
  const officeAndDetaljer = [office, detaljer ? `(${detaljer})` : ""]
    .filter(Boolean)
    .join(" ");

  return [typeAndName, officeAndDetaljer].filter(Boolean).join(", ");
};
