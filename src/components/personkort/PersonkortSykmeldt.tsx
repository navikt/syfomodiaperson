import React from "react";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import {
  formaterBostedsadresse,
  formaterKontaktadresse,
  formaterOppholdsadresse,
} from "@/utils/adresseUtils";
import { PersonImage } from "../../../img/ImageComponents";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { formaterFnr } from "@/utils/fnrUtils";
import { formatPhonenumber } from "@/utils/stringUtils";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

const texts = {
  fnr: "F.nummer",
  phone: "Telefon",
  email: "E-post",
  bostedsadresse: "Bostedsadresse",
  kontaktadresse: "Kontaktadresse",
  oppholdsadresse: "Oppholdsadresse",
};

export default function PersonkortSykmeldt() {
  const { data: personadresse } = usePersonAdresseQuery();
  const { data: kontaktinfo } = useKontaktinfoQuery();
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
  const fnr = useValgtPersonident();
  const formattedPhonenumber = kontaktinfo?.tlf
    ? formatPhonenumber(kontaktinfo.tlf)
    : kontaktinfo?.tlf;
  const valgteElementerKontaktinfo = {
    tlf: formattedPhonenumber,
    epost: kontaktinfo?.epost,
    fnr: formaterFnr(fnr),
  };
  const valgteElementer = Object.assign(
    {},
    valgteElementerKontaktinfo,
    valgteElementerAdresse
  );

  return (
    <PersonkortElement
      tittel="Kontaktinformasjon"
      antallKolonner={3}
      icon={<img src={PersonImage} alt={"Bilde av person"} />}
    >
      <PersonkortInformasjon
        informasjonNokkelTekster={informasjonNokkelTekster}
        informasjon={valgteElementer}
      />
    </PersonkortElement>
  );
}
