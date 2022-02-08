import React from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import PersonkortFeilmelding from "./PersonkortFeilmelding";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import { Fastlege } from "@/data/fastlege/types/Fastlege";
import {
  MedisinboksImage,
  MedisinskrinImage,
} from "../../../img/ImageComponents";
import { useFastlegerQuery } from "@/data/fastlege/fastlegerQueryHooks";

const texts = {
  startDate: "Brukers fastlege siden",
  name: "Legekontor",
  phone: "Telefon",
  error:
    "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.",
};

export const hentTekstFastlegeNavn = (fastlege?: Fastlege) => {
  return fastlege ? `${fastlege.fornavn} ${fastlege.etternavn}` : "";
};

const tidligereLegerTekst = (fastlege: Fastlege) => {
  return `${restdatoTilLesbarDato(
    fastlege.pasientforhold.fom
  )} - ${restdatoTilLesbarDato(
    fastlege.pasientforhold.tom
  )} ${hentTekstFastlegeNavn(fastlege)}`;
};

interface TidligereLegerProps {
  tidligereFastleger: Fastlege[];
}

export const TidligereLeger = ({ tidligereFastleger }: TidligereLegerProps) => {
  const fastlegerMedPasientforhold = tidligereFastleger.filter((lege) => {
    return lege.pasientforhold;
  });
  return fastlegerMedPasientforhold.length > 0 ? (
    <PersonkortElement
      tittel="Tidligere fastleger"
      imgUrl={MedisinboksImage}
      imgAlt="Medisinboks"
    >
      <ul>
        {fastlegerMedPasientforhold.map((lege, idx) => {
          return <li key={idx}>{tidligereLegerTekst(lege)}</li>;
        })}
      </ul>
    </PersonkortElement>
  ) : null;
};

const PersonkortLege = () => {
  const { aktivFastlege, tidligereFastleger, ikkeFunnet } = useFastlegerQuery();
  const informasjonNokkelTekster = new Map([
    ["fom", texts.startDate],
    ["navn", texts.name],
    ["telefon", texts.phone],
  ]);
  const valgteElementerKontor =
    aktivFastlege?.fastlegekontor &&
    (({ navn, telefon }) => {
      return { navn, telefon };
    })(aktivFastlege.fastlegekontor);
  const valgteElementerPasientforhold =
    aktivFastlege?.pasientforhold &&
    (({ fom }) => {
      return { fom };
    })({
      ...aktivFastlege.pasientforhold,
      fom:
        aktivFastlege.pasientforhold.fom &&
        restdatoTilLesbarDato(aktivFastlege.pasientforhold.fom),
    });
  const valgteElementer = {
    ...valgteElementerPasientforhold,
    ...valgteElementerKontor,
  };
  return ikkeFunnet ? (
    <PersonkortFeilmelding>{texts.error}</PersonkortFeilmelding>
  ) : (
    <>
      <PersonkortElement
        tittel={hentTekstFastlegeNavn(aktivFastlege)}
        imgUrl={MedisinskrinImage}
        imgAlt="Medisinskrin"
      >
        <PersonkortInformasjon
          informasjonNokkelTekster={informasjonNokkelTekster}
          informasjon={valgteElementer}
        />
      </PersonkortElement>
      <TidligereLeger tidligereFastleger={tidligereFastleger} />
    </>
  );
};

export default PersonkortLege;
