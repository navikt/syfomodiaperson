import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { Vis } from "@/utils";
import { StatusNokkelopplysning } from "@/components/speiling/Statuspanel";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

const texts = {
  status: {
    tittel: "Status",
    sender: "Sender...",
    avbrutt: "Avbrutt av deg",
    bekreftet: "Bekreftet av deg",
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

export const Sykmeldingstatus = (
  sykmeldingstatusProps: SykmeldingstatusProps
): ReactElement => {
  const { sykmelding } = sykmeldingstatusProps;
  return (
    <StatusNokkelopplysning tittel={texts.status.tittel}>
      {sykmelding.status === TIL_SENDING ? (
        <div className="medHjelpetekst">
          <span>{textStatus(sykmelding.status)}</span>
        </div>
      ) : (
        <p>{textStatus(sykmelding.status)}</p>
      )}
    </StatusNokkelopplysning>
  );
};

interface SendtDatoProps {
  sykmelding: SykmeldingOldFormat;
}

export const SendtDato = (sendtDatoProps: SendtDatoProps): ReactElement => {
  const { sykmelding } = sendtDatoProps;
  const tittel =
    sykmelding.status === BEKREFTET
      ? texts.dato.bekreftet
      : sykmelding.status === AVBRUTT
      ? texts.dato.avbrutt
      : texts.dato.sendt;
  return (
    <StatusNokkelopplysning tittel={tittel}>
      <p>{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
    </StatusNokkelopplysning>
  );
};

interface ArbeidsgiverProps {
  sykmelding: SykmeldingOldFormat;
}

export const Arbeidsgiver = (
  arbeidsgiverProps: ArbeidsgiverProps
): ReactElement => {
  const { sykmelding } = arbeidsgiverProps;
  return (
    <StatusNokkelopplysning tittel={texts.arbeidsgiver}>
      <p>{sykmelding.innsendtArbeidsgivernavn}</p>
    </StatusNokkelopplysning>
  );
};

interface OrgnummerProps {
  sykmelding: SykmeldingOldFormat;
}

export const Orgnummer = (orgnummerProps: OrgnummerProps): ReactElement => {
  const { sykmelding } = orgnummerProps;
  const orgnummer = sykmelding.orgnummer
    ? sykmelding.orgnummer.replace(/(...)(...)(...)/g, "$1 $2 $3")
    : null;
  return (
    <StatusNokkelopplysning tittel={texts.orgnr}>
      <p>{orgnummer}</p>
    </StatusNokkelopplysning>
  );
};

interface SykmeldingopplysningFravaersperioderProps {
  sykmelding: SykmeldingOldFormat;
  className?: string;
}

export const SykmeldingopplysningFravaersperioder = (
  sykmeldingopplysningFravaersperioderProps: SykmeldingopplysningFravaersperioderProps
): ReactElement => {
  const { sykmelding, className } = sykmeldingopplysningFravaersperioderProps;
  return (
    <Nokkelopplysning label={texts.egenmeldingPapir} className={className}>
      {sykmelding.sporsmal.fravaersperioder &&
      sykmelding.sporsmal.fravaersperioder.length > 0 ? (
        <ul className={"m-0 pl-6"}>
          {sykmelding.sporsmal.fravaersperioder?.map((p, index) => {
            return (
              <li key={index}>{tilLesbarPeriodeMedArstall(p.fom, p.tom)}</li>
            );
          })}
        </ul>
      ) : (
        <p>{texts.egenmeldingPapirNei}</p>
      )}
    </Nokkelopplysning>
  );
};

interface SykmeldingopplysningForsikringProps {
  sykmelding: SykmeldingOldFormat;
  className?: string;
}

export const SykmeldingopplysningForsikring = (
  sykmeldingopplysningForsikringProps: SykmeldingopplysningForsikringProps
): ReactElement => {
  const { sykmelding, className } = sykmeldingopplysningForsikringProps;
  const text = sykmelding.sporsmal.harForsikring ? texts.ja : texts.nei;
  return (
    <Nokkelopplysning label={texts.forsikring} className={className}>
      <p>{text}</p>
    </Nokkelopplysning>
  );
};

interface FrilansersporsmalProps {
  sykmelding: SykmeldingOldFormat;
}

export const Frilansersporsmal = (
  frilansersporsmalProps: FrilansersporsmalProps
): ReactElement => {
  const { sykmelding } = frilansersporsmalProps;
  return (
    <Vis
      hvis={
        sykmelding.sporsmal &&
        (sykmelding.sporsmal.harAnnetFravaer !== null ||
          sykmelding.sporsmal.harForsikring !== null)
      }
      render={() => {
        return [
          sykmelding.sporsmal.harAnnetFravaer !== null && (
            <SykmeldingopplysningFravaersperioder
              key={`fravaersperioder-${sykmelding.id}`}
              sykmelding={sykmelding}
              className="nokkelopplysning--statusopplysning"
            />
          ),
          sykmelding.sporsmal.harForsikring !== null && (
            <SykmeldingopplysningForsikring
              key={`forsikring-${sykmelding.id}`}
              sykmelding={sykmelding}
              className="nokkelopplysning--statusopplysning"
            />
          ),
        ];
      }}
    />
  );
};
