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
  harJobbet,
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Box, Heading, Tag } from "@navikt/ds-react";
import { ChevronRightIcon } from "@navikt/aksel-icons";

const texts = {
  tittel: "Søknad om sykepenger",
  fremtidig: "Planlagt",
  tilSoknad: "Til søknad",
  harJobbet: "Har jobbet",
};

function SendtUlikt({ soknad }: Props) {
  return (
    <span>
      {`Sendt til ${soknad.arbeidsgiver?.navn} ${toDatePrettyPrint(
        soknad.sendtTilArbeidsgiverDato
      )}`}
      <br />
      {`Sendt til Nav ${toDatePrettyPrint(soknad.sendtTilNAVDato)}`}
    </span>
  );
}

const textSoknadTeaserStatus = (
  key: string,
  dato?: string,
  arbeidsgiver?: string
) => {
  switch (key) {
    case "soknad.teaser.status.TIL_SENDING.til-arbeidsgiver-og-nav":
      return `Sender til ${arbeidsgiver} og Nav...`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver":
      return `Sendt til ${arbeidsgiver} ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver-og-nav":
      return `Sendt til ${arbeidsgiver} og Nav ${dato}`;
    default:
      return "";
  }
};

function beregnUndertekst(soknad: SykepengesoknadDTO) {
  const sendtTilBeggeMenIkkeSamtidig = erSendtTilBeggeMenIkkeSamtidig(soknad);

  switch (soknad.soknadstype) {
    case Soknadstype.OPPHOLD_UTLAND:
    case Soknadstype.ARBEIDSLEDIG:
    case Soknadstype.ANNET_ARBEIDSFORHOLD:
    case Soknadstype.SELVSTENDIGE_OG_FRILANSERE: {
      return soknad.status === Soknadstatus.SENDT && soknad.sendtTilNAVDato
        ? `Sendt til Nav ${tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}`
        : "";
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
        default: {
          return "";
        }
      }
    }
  }
}

function statusText(soknad: SykepengesoknadDTO): string {
  return soknadsStatusText(
    soknad.status,
    tilLesbarDatoMedArstall(
      soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
    )
  );
}

function soknadsStatusText(soknadStatus: Soknadstatus, dato?: string): string {
  switch (soknadStatus) {
    case Soknadstatus.NY:
      return "Ikke sendt";
    case Soknadstatus.TIL_SENDING:
      return "Sender...";
    case Soknadstatus.SENDT:
      return `Sendt ${dato}`;
    case Soknadstatus.UTKAST_TIL_KORRIGERING:
      return "Utkast til endring";
    case Soknadstatus.UTGAATT:
      return "Ikke brukt på nett";
    case Soknadstatus.FREMTIDIG:
      return "Planlagt";
    case Soknadstatus.AVBRUTT:
      return `Avbrutt av deg ${dato}`;
    default:
      return "";
  }
}

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SykepengesoknadListItem({
  soknad,
}: Props): ReactElement {
  const undertekst = beregnUndertekst(soknad);

  return (
    <Box
      background="surface-default"
      className="flex flex-col p-4 mt-2 mb-2 gap-2"
    >
      <div className="flex flex-row justify-between mb-2">
        <Heading level="4" size="xsmall" className="mr-4">
          {tittelFromSoknadstype(soknad.soknadstype)}
        </Heading>
        <Tag size="small" variant="info" className="w-fit">
          {statusText(soknad)}
        </Tag>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <BodyShort size="small">{`Opprettet ${tilLesbarDatoMedArstall(
            soknad.opprettetDato
          )}`}</BodyShort>
          {soknad.arbeidsgiver && (
            <BodyShort size="small">{soknad.arbeidsgiver.navn}</BodyShort>
          )}
          {undertekst && <BodyShort size="small">{undertekst}</BodyShort>}
          {soknad.soknadstype !== Soknadstype.OPPHOLD_UTLAND && (
            <BodyShort size="small">
              {`Gjelder for perioden ${tilLesbarPeriodeMedArstall(
                soknad.fom,
                soknad.tom
              )}
            `}
            </BodyShort>
          )}
          {harJobbet(soknad) && (
            <Tag size="small" variant="info" className="w-fit mt-2">
              {texts.harJobbet}
            </Tag>
          )}
        </div>
        <div className="flex flex-col justify-end">
          <Link
            className="flex flex-row h-fit"
            to={`/sykefravaer/sykepengesoknader/${soknad.id}`}
          >
            {texts.tilSoknad}
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </Box>
  );
}
