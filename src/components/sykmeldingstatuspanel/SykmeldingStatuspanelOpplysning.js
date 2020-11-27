import React from "react";
import PropTypes from "prop-types";
import {
  SykmeldingNokkelOpplysning,
  sykmeldingstatuser,
  tilLesbarPeriodeMedArstall,
  tilLesbarDatoMedArstall,
} from "@navikt/digisyfo-npm";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import { sykmelding as sykmeldingPt } from "../../propTypes";
import { Vis } from "../../utils";
import { StatusNokkelopplysning } from "../Statuspanel";

const texts = {
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
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

const { BEKREFTET, AVBRUTT, TIL_SENDING, SENDT } = sykmeldingstatuser;

const textStatus = (status) => {
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

const tilSendingHjelpetekst = () => {
  return <Hjelpetekst>{texts.hjelpetekst}</Hjelpetekst>;
};

export const Sykmeldingstatus = ({ sykmelding }) => {
  return (
    <StatusNokkelopplysning tittel={texts.status.tittel}>
      {sykmelding.status === TIL_SENDING ? (
        <div className="medHjelpetekst">
          <span>{textStatus(sykmelding.status)}</span>
          {tilSendingHjelpetekst()}
        </div>
      ) : (
        <p className="js-status">{textStatus(sykmelding.status)}</p>
      )}
    </StatusNokkelopplysning>
  );
};

Sykmeldingstatus.propTypes = {
  sykmelding: sykmeldingPt,
};

export const SendtDato = ({ sykmelding }) => {
  const tittel =
    sykmelding.status === BEKREFTET
      ? texts.dato.bekreftet
      : sykmelding.status === AVBRUTT
      ? texts.dato.avbrutt
      : texts.dato.sendt;
  return (
    <StatusNokkelopplysning tittel={tittel}>
      <p className="js-dato">{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
    </StatusNokkelopplysning>
  );
};

SendtDato.propTypes = {
  sykmelding: sykmeldingPt,
};

export const Arbeidsgiver = ({ sykmelding }) => {
  return (
    <StatusNokkelopplysning tittel={texts.arbeidsgiver}>
      <p className="js-arbeidsgiver">{sykmelding.innsendtArbeidsgivernavn}</p>
    </StatusNokkelopplysning>
  );
};

Arbeidsgiver.propTypes = {
  sykmelding: sykmeldingPt,
};

export const Orgnummer = ({ sykmelding }) => {
  const orgnummer = sykmelding.orgnummer
    ? sykmelding.orgnummer.replace(/(...)(...)(...)/g, "$1 $2 $3")
    : null;
  return (
    <StatusNokkelopplysning tittel={texts.orgnr}>
      <p className="js-organisasjonsnummer">{orgnummer}</p>
    </StatusNokkelopplysning>
  );
};

Orgnummer.propTypes = {
  sykmelding: sykmeldingPt,
};

export const SykmeldingopplysningFravaersperioder = ({
  sykmelding,
  className,
}) => {
  return sykmelding.sporsmal.harAnnetFravaer !== null ? (
    <SykmeldingNokkelOpplysning
      className={className}
      tittel={texts.egenmeldingPapir}
    >
      {sykmelding.sporsmal.fravaersperioder.length > 0 ? (
        <ul className="nokkelopplysning__liste">
          {sykmelding.sporsmal.fravaersperioder.map((p) => {
            return (
              <li key={tilLesbarDatoMedArstall(p.fom)}>
                {tilLesbarPeriodeMedArstall(p.fom, p.tom)}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{texts.egenmeldingPapirNei}</p>
      )}
    </SykmeldingNokkelOpplysning>
  ) : null;
};

SykmeldingopplysningFravaersperioder.propTypes = {
  sykmelding: sykmeldingPt,
  className: PropTypes.string,
};

export const SykmeldingopplysningForsikring = ({ sykmelding, className }) => {
  const text = sykmelding.sporsmal.harForsikring ? texts.ja : texts.nei;
  return sykmelding.sporsmal.harForsikring !== null ? (
    <SykmeldingNokkelOpplysning className={className} tittel={texts.forsikring}>
      <p>{text}</p>
    </SykmeldingNokkelOpplysning>
  ) : null;
};

SykmeldingopplysningForsikring.propTypes = {
  sykmelding: sykmeldingPt,
  className: PropTypes.string,
};

export const Frilansersporsmal = ({ sykmelding }) => {
  return (
    <Vis
      hvis={
        sykmelding.sporsmal &&
        (sykmelding.sporsmal.harAnnetFravaer !== null ||
          sykmelding.sporsmal.harForsikring !== null)
      }
      render={() => {
        return [
          <SykmeldingopplysningFravaersperioder
            key={`fravaersperioder-${sykmelding.id}`}
            sykmelding={sykmelding}
            className="nokkelopplysning--statusopplysning"
          />,
          <SykmeldingopplysningForsikring
            key={`forsikring-${sykmelding.id}`}
            sykmelding={sykmelding}
            className="nokkelopplysning--statusopplysning"
          />,
        ];
      }}
    />
  );
};

Frilansersporsmal.propTypes = {
  sykmelding: sykmeldingPt,
};
