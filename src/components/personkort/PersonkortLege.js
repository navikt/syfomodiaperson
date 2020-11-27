import React from "react";
import PropTypes from "prop-types";
import { restdatoTilLesbarDato } from "../../utils/datoUtils";
import PersonkortFeilmelding from "./PersonkortFeilmelding";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";

const texts = {
  startDate: "Brukers fastlege siden",
  name: "Legekontor",
  phone: "Telefon",
  error:
    "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.",
};

export const hentTekstFastlegeNavn = (fastlege) => {
  return fastlege ? `${fastlege.fornavn} ${fastlege.etternavn}` : "";
};

const tidligereLegerTekst = (fastlege) => {
  return `${restdatoTilLesbarDato(
    fastlege.pasientforhold.fom
  )} - ${restdatoTilLesbarDato(
    fastlege.pasientforhold.tom
  )} ${hentTekstFastlegeNavn(fastlege)}`;
};

export const TidligereLeger = ({ tidligereFastleger }) => {
  const fastlegerMedPasientforhold = tidligereFastleger.filter((lege) => {
    return lege.pasientforhold;
  });
  return fastlegerMedPasientforhold.length > 0 ? (
    <PersonkortElement
      tittel="Tidligere fastleger"
      imgUrl="/sykefravaer/img/svg/medisinboks.svg"
    >
      <ul>
        {fastlegerMedPasientforhold.map((lege, idx) => {
          return <li key={idx}>{tidligereLegerTekst(lege)}</li>;
        })}
      </ul>
    </PersonkortElement>
  ) : null;
};

TidligereLeger.propTypes = {
  tidligereFastleger: PropTypes.array,
};

const PersonkortLege = ({ fastleger }) => {
  const informasjonNokkelTekster = new Map([
    ["fom", texts.startDate],
    ["navn", texts.name],
    ["telefon", texts.phone],
  ]);
  const aktivFastlege = fastleger.aktiv;
  const valgteElementerKontor =
    aktivFastlege.fastlegekontor &&
    (({ navn, telefon }) => {
      return { navn, telefon };
    })(aktivFastlege.fastlegekontor);
  const valgteElementerPasientforhold =
    aktivFastlege.pasientforhold &&
    (({ fom }) => {
      return { fom };
    })(
      Object.assign({}, aktivFastlege.pasientforhold, {
        fom:
          aktivFastlege.pasientforhold.fom &&
          restdatoTilLesbarDato(aktivFastlege.pasientforhold.fom),
      })
    );
  const valgteElementer = Object.assign(
    {},
    valgteElementerPasientforhold,
    valgteElementerKontor
  );
  return fastleger.ikkeFunnet ? (
    <PersonkortFeilmelding>{texts.error}</PersonkortFeilmelding>
  ) : (
    [
      <PersonkortElement
        tittel={hentTekstFastlegeNavn(aktivFastlege)}
        imgUrl="/sykefravaer/img/svg/medisinskrin.svg"
      >
        <PersonkortInformasjon
          informasjonNokkelTekster={informasjonNokkelTekster}
          informasjon={valgteElementer}
        />
      </PersonkortElement>,
      <TidligereLeger tidligereFastleger={fastleger.tidligere} />,
    ]
  );
};

PersonkortLege.propTypes = {
  fastleger: PropTypes.object,
};

export default PersonkortLege;
