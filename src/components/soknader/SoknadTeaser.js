import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import {
  toDatePrettyPrint,
  sykepengesoknadstatuser,
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@navikt/digisyfo-npm";
import {
  sykepengesoknad as sykepengesoknadPt,
  soknad as soknadPt,
} from "../../propTypes";
import {
  getSendtTilSuffix,
  erSendtTilBeggeMenIkkeSamtidig,
} from "../../utils/sykepengesoknadUtils";
import {
  ARBEIDSLEDIG,
  ARBEIDSTAKERE,
  BEHANDLINGSDAGER,
  OPPHOLD_UTLAND,
  SELVSTENDIGE_OG_FRILANSERE,
  ANNET_ARBEIDSFORHOLD,
} from "../../enums/soknadtyper";
import { FREMTIDIG } from "../../enums/soknadstatuser";

const texts = {
  sendt: "Sendt til",
  fremtidig: "Planlagt",
  avbrutt: "Avbrutt av deg",
  teaser: "Gjelder perioden",
  utland: "Søknad om å beholde sykepenger utenfor EØS\n",
  tittel: "Søknad om sykepenger",
};

const textDato = (dato) => {
  return `Opprettet ${dato}`;
};

const textSendtTilArbeidsgiver = (dato, arbeidsgiver) => {
  return `${texts.sendt} ${arbeidsgiver} ${dato}`;
};

const textSendtTilNav = (dato) => {
  return `${texts.sendt} NAV ${dato}`;
};

const textAvbrutt = (dato) => {
  return `${texts.avbrutt} ${dato}`;
};

const textTeaserTekst = (periode) => {
  return `Gjelder for perioden ${periode}`;
};

const {
  NY,
  SENDT,
  TIL_SENDING,
  UTKAST_TIL_KORRIGERING,
  AVBRUTT,
} = sykepengesoknadstatuser;

export const SendtUlikt = ({ soknad }) => {
  return (
    <span>
      {textSendtTilArbeidsgiver(
        toDatePrettyPrint(soknad.sendtTilArbeidsgiverDato),
        soknad.arbeidsgiver.navn
      )}
      <br />
      {textSendtTilNav(soknad.arbeidsgiver.navn)}
    </span>
  );
};

SendtUlikt.propTypes = {
  soknad: sykepengesoknadPt.isRequired,
};

const visIkon = (soknadstype) => {
  return soknadstype === OPPHOLD_UTLAND ? (
    <img
      alt=""
      className="js-ikon"
      src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/globe.svg`}
    />
  ) : (
    <img
      alt=""
      className="js-ikon"
      src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/soknader.svg`}
    />
  );
};

const visIkonHover = (soknadstype) => {
  return soknadstype === OPPHOLD_UTLAND ? (
    <img
      alt=""
      className="js-ikon"
      src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/globe-hover.svg`}
    />
  ) : (
    <img
      alt=""
      className="js-ikon"
      src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/soknader_hover-blue.svg`}
    />
  );
};

const textSoknadTeaserStatus = (key, dato, arbeidsgiver) => {
  switch (key) {
    case "soknad.teaser.status.TIL_SENDING":
      return "Sender...";
    case "soknad.teaser.status.TIL_SENDING.til-arbeidsgiver-og-nav":
      return `Sender til ${arbeidsgiver} og NAV...`;
    case "soknad.teaser.status.SENDT":
      return `Sendt ${dato}`;
    case "soknad.teaser.status.SENDT.til-nav":
      return `Sendt til NAV ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver":
      return `Sendt til ${arbeidsgiver} ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver-og-nav":
      return `Sendt til ${arbeidsgiver} og NAV ${dato}`;
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

const beregnUndertekst = (soknad) => {
  const sendtTilBeggeMenIkkeSamtidig = erSendtTilBeggeMenIkkeSamtidig(soknad);

  if (soknad.status === AVBRUTT) {
    return textAvbrutt(tilLesbarDatoMedArstall(soknad.avbruttDato));
  }

  if (soknad.status === FREMTIDIG) {
    return texts.fremtidig;
  }

  switch (soknad.soknadstype) {
    case OPPHOLD_UTLAND:
    case ARBEIDSLEDIG:
    case ANNET_ARBEIDSFORHOLD:
    case SELVSTENDIGE_OG_FRILANSERE: {
      return soknad.status === SENDT && soknad.innsendtDato
        ? textSendtTilNav(tilLesbarDatoMedArstall(soknad.innsendtDato))
        : "";
    }
    case BEHANDLINGSDAGER:
    case ARBEIDSTAKERE: {
      switch (soknad.status) {
        case UTKAST_TIL_KORRIGERING:
        case NY: {
          const arbeidsgiver = soknad.arbeidsgiver
            ? soknad.arbeidsgiver.navn
            : soknad.sykmelding
            ? soknad.sykmelding.innsendtArbeidsgivernavn
            : "";
          return arbeidsgiver;
        }
        case SENDT:
        case TIL_SENDING: {
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
    default: {
      switch (soknad.status) {
        case SENDT:
        case TIL_SENDING: {
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
        case NY:
        case UTKAST_TIL_KORRIGERING: {
          return soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : "";
        }
        default: {
          return "";
        }
      }
    }
  }
};

export const TeaserUndertekst = ({ soknad }) => {
  const tekst = beregnUndertekst(soknad);

  return tekst ? (
    <p className="inngangspanel__undertekst js-undertekst mute">{tekst}</p>
  ) : (
    ""
  );
};

TeaserUndertekst.propTypes = {
  soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export const TeaserStatus = ({ soknad }) => {
  const visStatus = [NY, SENDT, AVBRUTT].indexOf(soknad.status) === -1;
  return visStatus ? (
    <p className="inngangspanel__status js-status">
      {textSoknadTeaserStatus(
        `soknad.teaser.status.${soknad.status}`,
        tilLesbarDatoMedArstall(
          soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
        ),
        null
      )}
    </p>
  ) : (
    ""
  );
};

TeaserStatus.propTypes = {
  soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export const TeaserTittel = ({ soknad }) => {
  return (
    <h3 className="js-title" id={`soknad-header-${soknad.id}`}>
      <small className="inngangspanel__meta js-meta">
        {textDato(tilLesbarDatoMedArstall(soknad.opprettetDato))}
      </small>
      <span className="inngangspanel__tittel">
        {soknad.soknadstype === OPPHOLD_UTLAND ? texts.utland : texts.tittel}
      </span>
    </h3>
  );
};

TeaserTittel.propTypes = {
  soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

export const TeaserPeriode = ({ soknad }) => {
  return soknad.soknadstype !== OPPHOLD_UTLAND ? (
    <p className="inngangspanel__tekst js-tekst">
      {textTeaserTekst(tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom))}
    </p>
  ) : (
    ""
  );
};

TeaserPeriode.propTypes = {
  soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
};

const SykepengesoknadTeaser = ({ soknad, fnr }) => {
  const status = soknad.status ? soknad.status.toLowerCase() : "";
  return (
    <article aria-labelledby={`soknader-header-${soknad.id}`}>
      <Link
        className={`inngangspanel js-panel js-soknad-${status}`}
        to={`/sykefravaer/${fnr}/sykepengesoknader/${soknad.id}`}
      >
        <span className="inngangspanel__ikon inngangspanel__ikon--normal">
          {visIkon(soknad.soknadstype)}
        </span>
        <span className="inngangspanel__ikon inngangspanel__ikon--hover">
          {visIkonHover(soknad.soknadstype)}
        </span>
        <div className="inngangspanel__innhold">
          <header className="inngangspanel__header">
            <TeaserTittel soknad={soknad} />
            <TeaserStatus soknad={soknad} />
          </header>
          <TeaserPeriode soknad={soknad} />
          <TeaserUndertekst soknad={soknad} />
        </div>
      </Link>
    </article>
  );
};

SykepengesoknadTeaser.propTypes = {
  soknad: PropTypes.oneOfType([sykepengesoknadPt, soknadPt]).isRequired,
  fnr: PropTypes.string,
};

export default SykepengesoknadTeaser;
