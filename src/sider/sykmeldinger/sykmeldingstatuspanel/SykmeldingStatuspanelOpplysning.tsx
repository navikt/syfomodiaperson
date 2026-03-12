import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";

const texts = {
  status: {
    tittel: "Status",
    sender: "Sender...",
    avbrutt: "Avbrutt av den sykmeldte",
    bekreftet: "Bekreftet av den sykmeldte",
    sendt: "Sendt til arbeidsgiver",
  },
  dato: {
    bekreftet: "Dato bekreftet",
    avbrutt: "Dato avbrutt",
    sendt: "Dato sendt",
  },
  arbeidsgiver: "Arbeidsgiver",
  orgnr: "Organisasjonsnummer",
  egenmeldingPapir: "Egenmelding og/eller sykmelding på papir",
  egenmeldingPapirNei: "Har ikke hatt egenmelding og/eller sykmelding på papir",
  forsikring: "Forsikring",
  ja: "Ja",
  nei: "Har ikke forsikring som gjelder de første 16 dagene av sykefraværet",
};

const { BEKREFTET, AVBRUTT, TIL_SENDING, SENDT } = SykmeldingStatus;

const textStatus = (status: SykmeldingStatus) => {
  switch (status) {
    case BEKREFTET:
      return texts.status.bekreftet;
    case AVBRUTT:
      return texts.status.avbrutt;
    case TIL_SENDING:
      return texts.status.sender;
    case SENDT:
      return texts.status.sendt;
    default:
      return "";
  }
};

interface SykmeldingstatusProps {
  sykmelding: SykmeldingOldFormat;
}

export function Sykmeldingstatus({ sykmelding }: SykmeldingstatusProps) {
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.status.tittel}
      </Heading>
      <BodyShort size="small">{textStatus(sykmelding.status)}</BodyShort>
    </div>
  );
}

interface SendtDatoProps {
  sykmelding: SykmeldingOldFormat;
}

export function SendtDato({ sykmelding }: SendtDatoProps) {
  const tittel =
    sykmelding.status === BEKREFTET
      ? texts.dato.bekreftet
      : sykmelding.status === AVBRUTT
      ? texts.dato.avbrutt
      : texts.dato.sendt;
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {tittel}
      </Heading>
      <BodyShort size="small">
        {tilLesbarDatoMedArstall(sykmelding.sendtdato)}
      </BodyShort>
    </div>
  );
}

interface ArbeidsgiverProps {
  sykmelding: SykmeldingOldFormat;
}

export function Arbeidsgiver({ sykmelding }: ArbeidsgiverProps) {
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.arbeidsgiver}
      </Heading>
      <BodyShort size="small">{sykmelding.innsendtArbeidsgivernavn}</BodyShort>
    </div>
  );
}

interface OrgnummerProps {
  sykmelding: SykmeldingOldFormat;
}

export function Orgnummer({ sykmelding }: OrgnummerProps) {
  const orgnummer = sykmelding.orgnummer
    ? sykmelding.orgnummer.replace(/(...)(...)(...)/g, "$1 $2 $3")
    : null;
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.orgnr}
      </Heading>
      <BodyShort size="small">{orgnummer}</BodyShort>
    </div>
  );
}

interface SykmeldingopplysningFravaersperioderProps {
  sykmelding: SykmeldingOldFormat;
}

export function SykmeldingopplysningFravaersperioder({
  sykmelding,
}: SykmeldingopplysningFravaersperioderProps) {
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.egenmeldingPapir}
      </Heading>
      {sykmelding.sporsmal.fravaersperioder &&
      sykmelding.sporsmal.fravaersperioder.length > 0 ? (
        <ul className="m-0 pl-6">
          {sykmelding.sporsmal.fravaersperioder?.map((p, index) => {
            return (
              <li key={index}>{tilLesbarPeriodeMedArstall(p.fom, p.tom)}</li>
            );
          })}
        </ul>
      ) : (
        <BodyLong size="small">{texts.egenmeldingPapirNei}</BodyLong>
      )}
    </div>
  );
}

interface SykmeldingopplysningForsikringProps {
  sykmelding: SykmeldingOldFormat;
}

export function SykmeldingopplysningForsikring({
  sykmelding,
}: SykmeldingopplysningForsikringProps) {
  const text = sykmelding.sporsmal.harForsikring ? texts.ja : texts.nei;
  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.forsikring}
      </Heading>
      <BodyLong size="small">{text}</BodyLong>
    </div>
  );
}

interface FrilansersporsmalProps {
  sykmelding: SykmeldingOldFormat;
}

export function Frilansersporsmal({ sykmelding }: FrilansersporsmalProps) {
  return (
    sykmelding.sporsmal &&
    (sykmelding.sporsmal.harAnnetFravaer !== null ||
      sykmelding.sporsmal.harForsikring !== null) && (
      <>
        {sykmelding.sporsmal.harAnnetFravaer !== null && (
          <SykmeldingopplysningFravaersperioder sykmelding={sykmelding} />
        )}
        {sykmelding.sporsmal.harForsikring !== null && (
          <SykmeldingopplysningForsikring sykmelding={sykmelding} />
        )}
      </>
    )
  );
}
