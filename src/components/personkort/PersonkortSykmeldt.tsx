import React from "react";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import { formaterFnr } from "@/utils/fnrUtils";
import {
  formaterBostedsadresse,
  formaterKontaktadresse,
  formaterOppholdsadresse,
} from "@/utils/pdladresseUtils";
import { PersonImage } from "../../../img/ImageComponents";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";

const texts = {
  fnr: "F.nummer",
  phone: "Telefon",
  email: "E-post",
  bostedsadresse: "Bostedsadresse",
  kontaktadresse: "Kontaktadresse",
  oppholdsadresse: "Oppholdsadresse",
};

interface PersonkortSykmeldtProps {
  navbruker: Brukerinfo;
}

const PersonkortSykmeldt = ({ navbruker }: PersonkortSykmeldtProps) => {
  const { data: personadresse } = usePersonAdresseQuery();
  const informasjonNokkelTekster = new Map([
    ["fnr", texts.fnr],
    ["tlf", texts.phone],
    ["epost", texts.email],
    ["bostedsadresse", texts.bostedsadresse],
    ["kontaktadresse", texts.kontaktadresse],
    ["oppholdsadresse", texts.oppholdsadresse],
  ]);
  const valgteElementerAdresse = (({
    bostedsadresse,
    kontaktadresse,
    oppholdsadresse,
  }) => {
    return { bostedsadresse, kontaktadresse, oppholdsadresse };
  })({
    bostedsadresse: formaterBostedsadresse(personadresse?.bostedsadresse),
    kontaktadresse: formaterKontaktadresse(personadresse?.kontaktadresse),
    oppholdsadresse: formaterOppholdsadresse(personadresse?.oppholdsadresse),
  });
  const valgteElementerKontaktinfo = (({ tlf, epost, fnr }) => {
    return {
      tlf,
      epost,
      fnr: formaterFnr(fnr),
    };
  })(navbruker.kontaktinfo);
  const valgteElementer = Object.assign(
    {},
    valgteElementerKontaktinfo,
    valgteElementerAdresse
  );

  return (
    <PersonkortElement
      tittel="Kontaktinformasjon"
      imgUrl={PersonImage}
      imgAlt="Bilde av person"
      antallKolonner={3}
    >
      <PersonkortInformasjon
        informasjonNokkelTekster={informasjonNokkelTekster}
        informasjon={valgteElementer}
      />
    </PersonkortElement>
  );
};

export default PersonkortSykmeldt;
