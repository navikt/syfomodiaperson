import { ReactElement } from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { Adresse, Fastlege } from "@/data/fastlege/types/Fastlege";
import { useFastlegerQuery } from "@/data/fastlege/fastlegerQueryHooks";
import PersonkortInformasjon from "@/components/personkort/PersonkortInformasjon";
import { FlexColumn, FlexRow } from "@/components/Layout";
import { Alert, Detail, Heading } from "@navikt/ds-react";
import { formatPhonenumber } from "@/utils/stringUtils";

const texts = {
  name: "Legekontor",
  phone: "Telefon",
  visitingAdress: "Besøksadresse",
  postalAddress: "Postadresse",
  vikar: "Vikar",
  error:
    "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.",
};

function hentTekstFastlegeNavn(fastlege?: Fastlege) {
  return fastlege ? `${fastlege.fornavn} ${fastlege.etternavn}` : "";
}

function hentTekstFastlegePeriode(fastlege: Fastlege): string {
  return `Fastlege: ${restdatoTilLesbarDato(fastlege.pasientforhold.fom)} - nå`;
}

function hentTekstFastlegeBesoeksadresse(besoeksadresse: Adresse): string {
  return besoeksadresse
    ? `${besoeksadresse.adresse}, ${besoeksadresse.postnummer} ${besoeksadresse.poststed}`
    : "";
}

function hentTekstFastlegePostadresse(postadresse: Adresse): string {
  return postadresse
    ? `${postadresse.adresse}, ${postadresse.postnummer} ${postadresse.poststed}`
    : "";
}

function fastlegeVikarTekst(fastlegeVikar: Fastlege) {
  const vikarlegeNavn = hentTekstFastlegeNavn(fastlegeVikar);
  const periodeTekst = `${restdatoTilLesbarDato(
    fastlegeVikar.gyldighet.fom,
  )} - ${restdatoTilLesbarDato(fastlegeVikar.gyldighet.tom)}`;
  const stillingsprosentTekst =
    fastlegeVikar.stillingsprosent && `${fastlegeVikar.stillingsprosent}%`;
  return (
    <>
      <FlexColumn className="mr-[1.5em]">
        <b>{vikarlegeNavn}</b>
      </FlexColumn>
      <FlexColumn className="mr-[1.5em]">{periodeTekst}</FlexColumn>
      {stillingsprosentTekst && (
        <FlexColumn className="mr-[1.5em]">{stillingsprosentTekst}</FlexColumn>
      )}
    </>
  );
}
interface FastlegeVikarProps {
  fastlegeVikarer: Fastlege[];
}

export const FastlegeVikar = ({
  fastlegeVikarer,
}: FastlegeVikarProps): ReactElement => {
  return (
    <>
      <Heading size="medium">{texts.vikar}</Heading>
      {fastlegeVikarer.map((lege, idx) => {
        return <FlexRow key={idx}>{fastlegeVikarTekst(lege)}</FlexRow>;
      })}
    </>
  );
};

export function PersonkortLege() {
  const { fastlege, fastlegeVikarer, ikkeFunnet } = useFastlegerQuery();
  const fastlegekontor = fastlege?.fastlegekontor;

  const informasjonNokkelTekster = new Map([
    ["navn", texts.name],
    ["tlf", texts.phone],
    ["besoeksadresse", texts.visitingAdress],
    ["postadresse", texts.postalAddress],
  ]);

  const valgteElementerBesoksadresse =
    fastlege?.fastlegekontor?.besoeksadresse &&
    (({ besoeksadresse }) => {
      return { besoeksadresse };
    })({
      besoeksadresse: hentTekstFastlegeBesoeksadresse(
        fastlege.fastlegekontor.besoeksadresse,
      ),
    });

  const valgteElementerPostadresse =
    fastlege?.fastlegekontor?.postadresse &&
    (({ postadresse }) => {
      return { postadresse };
    })({
      postadresse: hentTekstFastlegePostadresse(
        fastlege.fastlegekontor.postadresse,
      ),
    });

  const valgteElementerKontor =
    fastlege?.fastlegekontor &&
    (({ navn, telefon }) => {
      const tlf = telefon ? formatPhonenumber(telefon) : telefon;
      return { navn, tlf };
    })(fastlege.fastlegekontor);

  const valgteElementer = {
    ...valgteElementerKontor,
    ...valgteElementerBesoksadresse,
    ...valgteElementerPostadresse,
  };

  return ikkeFunnet ? (
    <Alert variant="info" size="small">
      {texts.error}
    </Alert>
  ) : (
    <>
      {fastlege && (
        <>
          <Heading size="medium">{hentTekstFastlegeNavn(fastlege)}</Heading>
          <Detail>{hentTekstFastlegePeriode(fastlege)}</Detail>
        </>
      )}
      {fastlegekontor && (
        <PersonkortInformasjon
          informasjonNokkelTekster={informasjonNokkelTekster}
          informasjon={valgteElementer}
        />
      )}
      {fastlegeVikarer.length > 0 && (
        <FastlegeVikar fastlegeVikarer={fastlegeVikarer} />
      )}
    </>
  );
}
