import React from "react";
import {
  formaterBostedsadresse,
  formaterKontaktadresse,
  formaterOppholdsadresse,
} from "@/utils/adresseUtils";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { formaterFnr } from "@/utils/fnrUtils";
import { formatPhonenumber } from "@/utils/stringUtils";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  fnr: "F.nummer",
  phone: "Telefon",
  email: "E-post",
  bostedsadresse: "Bostedsadresse",
  kontaktadresse: "Kontaktadresse",
  oppholdsadresse: "Oppholdsadresse",
  empty: "—",
};

export function PersonkortSykmeldt() {
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
    valgteElementerAdresse,
  );

  return (
    <div className="grid grid-cols-3 gap-y-4 gap-x-16 w-fit">
      {Object.keys(valgteElementer).map((nokkel, idx) => {
        return (
          <div key={idx}>
            <BodyShort size="small" weight="semibold">
              {informasjonNokkelTekster.get(nokkel)}
            </BodyShort>
            <BodyShort size="small">
              {valgteElementer[nokkel] ? valgteElementer[nokkel] : texts.empty}
            </BodyShort>
          </div>
        );
      })}
    </div>
  );
}
