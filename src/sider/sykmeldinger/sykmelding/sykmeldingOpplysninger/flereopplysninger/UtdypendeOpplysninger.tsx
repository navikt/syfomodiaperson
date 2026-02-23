import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  title: "Utdypende opplysninger",
};

function OpplysningsGruppe(opplysningsGruppeProps: {
  opplysningGruppe: SporsmalSvarDTO;
}) {
  const { opplysningGruppe } = opplysningsGruppeProps;
  const sporsmal = Object.entries(opplysningGruppe).map(
    ([key, sporsmalSvar]) => (
      <div key={key} className="mb-5">
        <Heading level="4" size="xsmall" className="mb-1">
          {sporsmalSvar.sporsmal}
        </Heading>
        <BodyLong size="small">{sporsmalSvar.svar}</BodyLong>
      </div>
    )
  );
  return <div>{sporsmal}</div>;
}

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function UtdypendeOpplysninger(
  utdypendeOpplysningerProps: Props
) {
  const { sykmelding } = utdypendeOpplysningerProps;
  const utdypendeOpplysninger = sykmelding.utdypendeOpplysninger;
  return (
    <>
      <Heading level="3" size="medium">
        {texts.title}
      </Heading>
      {Object.entries(utdypendeOpplysninger).map(([key, opplysningGruppe]) => (
        <OpplysningsGruppe key={key} opplysningGruppe={opplysningGruppe} />
      ))}
    </>
  );
}
