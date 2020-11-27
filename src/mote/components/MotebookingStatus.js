import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import AlertStripe from "nav-frontend-alertstriper";
import * as moterPropTypes from "../../propTypes";
import { getDatoFraZulu, erMotePassert } from "../utils";
import Sidetopp from "../../components/Sidetopp";
import KontaktInfoFeilmelding from "./KontaktInfoFeilmelding";
import BekreftetMotetidspunkt from "./BekreftetMotetidspunkt";
import InformasjonSendt from "./InformasjonSendt";
import FlereTidspunktSkjema from "../skjema/FlereTidspunktSkjema";
import Svarstatus from "./Svarstatus";

const texts = {
  valgSendtTilParter: "Møtetidspunkt valgt, møteresultat sendt til partene",
  foresporselSendtTil: "Møteforespørselen ble sendt til",
  bekreftetSendtTil: "Møtetidspunkt valgt, møteresultat og varsel er sendt til",
  sendt: "Sendt:",
  passert: "De foreslåtte tidspunktene er passert",
  passertVarsel: "Ingen av tidspunktene ble bekreftet",
  planleggNyttMote: "Planlegg nytt møte",
  avbrytMote: "Avbryt møte",
  motested: "Møtested:",
  forrigeMote: "Forrige møte",
  bookingTittel: "Svar på møteforespørsel",
  bekreftetBooking: "Bekreftet møtetidspunkt",
};

const textWithParameter = (text, date) => {
  return `${text} ${date}`;
};

export const MotetidspunktValgt = ({ bekreftetTidspunkt }) => {
  return (
    <div className="motetidspunktValgt">
      {textWithParameter(
        texts.valgSendtTilParter,
        getDatoFraZulu(bekreftetTidspunkt)
      )}
    </div>
  );
};

const BEKREFTET = "BEKREFTET";
const OPPRETTET = "OPPRETTET";
const FLERE_TIDSPUNKT = "FLERE_TIDSPUNKT";
export const kvitteringTekst = {
  overskrift:
    "Blir det sendt spørsmål om behov for møte til sykmeldt og nærmeste leder?",
  forUke16:
    "Hvis du har brukt møteplanleggeren før uke 16: Spørsmålet om behov for møte vil ikke bli sendt ut.",
  etterUke16:
    "Hvis du har sendt forslag til møtetidspunkt etter uke 16: Spørsmålet om behov forsvinner fra nav.no hvis de ikke har svart ennå.",
};

MotetidspunktValgt.propTypes = {
  bekreftetTidspunkt: PropTypes.string,
};

export const getLedetekstFraFeilAarsak = () => {
  return {
    __html:
      "<div>\n<p>Vi klarte ikke å finne kontaktinformasjon om den sykmeldte og kan derfor ikke sende varsler til personen.</p>\n</div>",
  };
};

const getSendtTilTekst = (mote, arbeidstaker) => {
  const navneliste = mote.deltakere
    .filter((deltaker) => {
      return (
        deltaker.type === "arbeidsgiver" ||
        arbeidstaker.kontaktinfo.skalHaVarsel
      );
    })
    .map((deltaker) => {
      return deltaker.navn;
    });
  const text =
    mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT
      ? texts.foresporselSendtTil
      : texts.bekreftetSendtTil;
  return textWithParameter(text, navneliste.join(" og "));
};

const getSidetoppTekst = (mote, motePassert) => {
  if (motePassert) {
    return texts.forrigeMote;
  } else if (mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT) {
    return texts.bookingTittel;
  }
  return texts.bekreftetBooking;
};

export const StatusVarsel = ({ mote, arbeidstaker }) => {
  const dato =
    mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT
      ? mote.opprettetTidspunkt
      : mote.bekreftetAlternativ.created;
  return (
    <div className="panel statusVarsel">
      <AlertStripe type="suksess">
        <div>
          <p className="typo-element">{getSendtTilTekst(mote, arbeidstaker)}</p>
          <p className="sist">
            {textWithParameter(texts.sendt, getDatoFraZulu(dato))}
          </p>
        </div>
      </AlertStripe>
      <AlertStripe type="info">
        <div>
          <p className="typo-element">{kvitteringTekst.overskrift}</p>
          <p className="sist">
            {
              <ul>
                <li>{kvitteringTekst.forUke16}</li>
                <li>{kvitteringTekst.etterUke16}</li>
              </ul>
            }
          </p>
        </div>
      </AlertStripe>
    </div>
  );
};

StatusVarsel.propTypes = {
  mote: moterPropTypes.motePt,
  arbeidstaker: PropTypes.object,
};

export const PassertVarsel = () => {
  return (
    <AlertStripe type="info">
      <div>
        <p className="typo-element">{texts.passert}</p>
        <p className="sist">{texts.passertVarsel}</p>
      </div>
    </AlertStripe>
  );
};

const MotebookingStatus = (props) => {
  const {
    fnr,
    mote,
    avbrytMoteUtenVarsel,
    skalViseFlereAlternativ,
    arbeidstaker,
  } = props;
  const { alternativer, status } = mote;
  const krrMeldingPanel = !arbeidstaker.kontaktinfo.skalHaVarsel ? (
    <KontaktInfoFeilmelding melding={getLedetekstFraFeilAarsak()} />
  ) : null;
  const motePassert = erMotePassert(mote);
  const flereTidspunktBoks = skalViseFlereAlternativ ? (
    <FlereTidspunktSkjema
      {...props}
      antallEksisterendeTidspunkter={alternativer.length}
    />
  ) : null;
  const sidetoppTekst = getSidetoppTekst(mote, motePassert);
  const knapp = erMotePassert(mote) ? (
    <button
      className="js-ny knapp"
      onClick={() => {
        avbrytMoteUtenVarsel(mote.moteUuid, fnr);
      }}
    >
      {texts.planleggNyttMote}
    </button>
  ) : (
    <Link
      role="button"
      className="knapp knapp--enten js-avbryt"
      to={`/sykefravaer/${fnr}/mote/${mote.moteUuid}/avbryt`}
    >
      {texts.avbrytMote}
    </Link>
  );

  return (
    <div>
      <Sidetopp tittel={sidetoppTekst} />
      {!motePassert && <StatusVarsel mote={mote} arbeidstaker={arbeidstaker} />}
      {krrMeldingPanel}
      <div className="panel">
        {status === BEKREFTET && <BekreftetMotetidspunkt {...props} />}
        {status !== BEKREFTET && !motePassert && (
          <Svarstatus {...props}>{flereTidspunktBoks}</Svarstatus>
        )}
        {status !== BEKREFTET && motePassert && <PassertVarsel />}
        <div className="motested">
          <h3 className="motested__tittel">{texts.motested}</h3>
          <p className="motested__sted">{mote.alternativer[0].sted}</p>
        </div>
        {status === BEKREFTET && !motePassert && (
          <InformasjonSendt {...props} />
        )}
        <div className="knapperad">{knapp}</div>
      </div>
    </div>
  );
};

MotebookingStatus.propTypes = {
  mote: moterPropTypes.motePt,
  antallNyeTidspunkt: PropTypes.number,
  fnr: PropTypes.string,
  arbeidstaker: PropTypes.object,
  senderNyeAlternativ: PropTypes.bool,
  nyeAlternativFeilet: PropTypes.bool,
  fikkIkkeOpprettetVarsel: PropTypes.object,
  avbrytMoteUtenVarsel: PropTypes.func,
  flereAlternativ: PropTypes.func,
  opprettFlereAlternativ: PropTypes.func,
  avbrytFlereAlternativ: PropTypes.func,
  skalViseFlereAlternativ: PropTypes.bool,
};

export default MotebookingStatus;
