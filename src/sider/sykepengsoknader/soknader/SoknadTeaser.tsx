import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  erSendtTilBeggeMenIkkeSamtidig,
  getSendtTilSuffix,
  tittelFromSoknadstype,
} from "@/utils/sykepengesoknadUtils";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
  toDatePrettyPrint,
} from "@/utils/datoUtils";

import {
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { ChevronRightIcon } from "@navikt/aksel-icons";

const texts = {
  tittel: "Søknad om sykepenger",
  sendt: "Sendt til",
  fremtidig: "Planlagt",
  avbrutt: "Avbrutt av deg",
  tilSoknad: "Til søknad",
};

const textSendtTilNav = (dato?: string) => {
  return `${texts.sendt} Nav ${dato}`;
};

const textAvbrutt = (dato?: string) => {
  return `${texts.avbrutt} ${dato}`;
};

const SendtUlikt = ({ soknad }: Props) => {
  const textSendtTilArbeidsgiver = `${texts.sendt} ${
    soknad.arbeidsgiver?.navn
  } ${toDatePrettyPrint(soknad.sendtTilArbeidsgiverDato)}`;
  return (
    <span>
      {textSendtTilArbeidsgiver}
      <br />
      {textSendtTilNav(toDatePrettyPrint(soknad.sendtTilNAVDato))}
    </span>
  );
};

const textSoknadTeaserStatus = (
  key: string,
  dato?: string,
  arbeidsgiver?: string
) => {
  switch (key) {
    case "soknad.teaser.status.TIL_SENDING":
      return "Sender...";
    case "soknad.teaser.status.TIL_SENDING.til-arbeidsgiver-og-nav":
      return `Sender til ${arbeidsgiver} og Nav...`;
    case "soknad.teaser.status.SENDT":
      return `Sendt ${dato}`;
    case "soknad.teaser.status.SENDT.til-nav":
      return `Sendt til Nav ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver":
      return `Sendt til ${arbeidsgiver} ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver-og-nav":
      return `Sendt til ${arbeidsgiver} og Nav ${dato}`;
    case "soknad.teaser.status.UTKAST_TIL_KORRIGERING":
      return "Utkast til endring";
    case "soknad.teaser.status.UTGAATT":
      return "Ikke brukt på nett";
    case "soknad.teaser.status.FREMTIDIG":
      return "Planlagt";
    case "soknad.teaser.status.AVBRUTT":
      return textAvbrutt(dato);
    default:
      return "";
  }
};

const beregnUndertekst = (soknad: SykepengesoknadDTO) => {
  const sendtTilBeggeMenIkkeSamtidig = erSendtTilBeggeMenIkkeSamtidig(soknad);

  if (soknad.status === Soknadstatus.AVBRUTT) {
    return textAvbrutt(tilLesbarDatoMedArstall(soknad.avbruttDato));
  } else if (soknad.status === Soknadstatus.FREMTIDIG) {
    return texts.fremtidig;
  }

  switch (soknad.soknadstype) {
    case Soknadstype.OPPHOLD_UTLAND:
    case Soknadstype.ARBEIDSLEDIG:
    case Soknadstype.ANNET_ARBEIDSFORHOLD:
    case Soknadstype.SELVSTENDIGE_OG_FRILANSERE: {
      return soknad.status === Soknadstatus.SENDT && soknad.sendtTilNAVDato
        ? textSendtTilNav(tilLesbarDatoMedArstall(soknad.sendtTilNAVDato))
        : "";
    }
    case Soknadstype.BEHANDLINGSDAGER:
    case Soknadstype.ARBEIDSTAKERE: {
      switch (soknad.status) {
        case Soknadstatus.UTKAST_TIL_KORRIGERING:
        case Soknadstatus.NY: {
          return soknad.arbeidsgiver?.navn ?? "";
        }
        case Soknadstatus.SENDT:
        case Soknadstatus.TIL_SENDING: {
          return sendtTilBeggeMenIkkeSamtidig ? (
            <SendtUlikt soknad={soknad} />
          ) : (
            textSoknadTeaserStatus(
              `soknad.teaser.status.${soknad.status}${getSendtTilSuffix(
                soknad
              )}`,
              tilLesbarDatoMedArstall(
                soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
              ),
              soknad.arbeidsgiver?.navn ?? ""
            )
          );
        }
        default: {
          return "";
        }
      }
    }
    default: {
      switch (soknad.status) {
        case Soknadstatus.SENDT:
        case Soknadstatus.TIL_SENDING: {
          return sendtTilBeggeMenIkkeSamtidig ? (
            <SendtUlikt soknad={soknad} />
          ) : (
            textSoknadTeaserStatus(
              `soknad.teaser.status.${soknad.status}${getSendtTilSuffix(
                soknad
              )}`,
              tilLesbarDatoMedArstall(
                soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
              ),
              soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : ""
            )
          );
        }
        case Soknadstatus.NY:
        case Soknadstatus.UTKAST_TIL_KORRIGERING: {
          return soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : "";
        }
        default: {
          return "";
        }
      }
    }
  }
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SykepengesoknadTeaser({ soknad }: Props): ReactElement {
  const visStatus =
    [Soknadstatus.NY, Soknadstatus.SENDT, Soknadstatus.AVBRUTT].indexOf(
      soknad.status
    ) === -1;
  const undertekst = beregnUndertekst(soknad);

  function statusText(soknad: SykepengesoknadDTO): string {
    return textSoknadTeaserStatus(
      `soknad.teaser.status.${soknad.status}`,
      tilLesbarDatoMedArstall(
        soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
      )
    );
  }

  return (
    <Box
      background="surface-default"
      className="flex flex-col p-4 mt-2 mb-2 gap-2"
    >
      <div className="flex flex-row justify-between">
        <Heading level="4" size="xsmall" className="mb-2">
          {tittelFromSoknadstype(soknad.soknadstype)}
        </Heading>
        {visStatus && <BodyShort size="small">{statusText(soknad)}</BodyShort>}
      </div>
      <BodyShort size="small">{`Opprettet ${tilLesbarDatoMedArstall(
        soknad.opprettetDato
      )}`}</BodyShort>
      {undertekst && <BodyShort size="small">{undertekst}</BodyShort>}
      <div className="flex flex-row items-center">
        {soknad.soknadstype !== Soknadstype.OPPHOLD_UTLAND && (
          <BodyShort size="small">
            {`Gjelder for perioden ${tilLesbarPeriodeMedArstall(
              soknad.fom,
              soknad.tom
            )}
            `}
          </BodyShort>
        )}
        <Link
          className="flex flex-row h-fit ml-auto"
          to={`/sykefravaer/sykepengesoknader/${soknad.id}`}
        >
          {texts.tilSoknad}
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </Box>
  );
}
