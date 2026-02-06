import React from "react";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";
import { BodyLong, BodyShort, VStack } from "@navikt/ds-react";

const tekster = {
  utdypendeOpplysninger: "Utdypende opplysninger ved 8 uker",
};

interface OpplysningsGruppeProps {
  opplysningGruppe: Map<string, SporsmalSvarDTO>;
}

function OpplysningsGruppe({ opplysningGruppe }: OpplysningsGruppeProps) {
  return (
    <>
      {Object.entries(opplysningGruppe).map(([key, sporsmalSvar]) => (
        <div key={key}>
          <BodyShort size="small" weight="semibold">
            {sporsmalSvar.sporsmal}
          </BodyShort>
          <BodyLong size="small">{sporsmalSvar.svar}</BodyLong>
        </div>
      ))}
    </>
  );
}

interface UtdypendeOpplysningerProps {
  utdypendeOpplysninger: Map<string, Map<string, SporsmalSvarDTO>>;
}

export function UtdypendeOpplysninger({
  utdypendeOpplysninger,
}: UtdypendeOpplysningerProps) {
  return (
    <VStack gap="2" className="pt-4">
      <BodyShort size="small" weight="semibold">
        {tekster.utdypendeOpplysninger}
      </BodyShort>

      {Object.entries(utdypendeOpplysninger).map(([key, opplysningGruppe]) => (
        <OpplysningsGruppe key={key} opplysningGruppe={opplysningGruppe} />
      ))}
    </VStack>
  );
}
