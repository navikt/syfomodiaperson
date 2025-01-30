import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { OpplysningListItem } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/OpplysningListItem";

const texts = {
  title: "Utdypende opplysninger",
};

interface OpplysningsGruppeProps {
  opplysningGruppe: SporsmalSvarDTO;
}

const OpplysningsGruppe = (opplysningsGruppeProps: OpplysningsGruppeProps) => {
  const { opplysningGruppe } = opplysningsGruppeProps;
  const sporsmal = Object.entries(opplysningGruppe).map(
    ([key, sporsmalSvar]) => (
      <SykmeldingOpplysning key={key} tittel={sporsmalSvar.sporsmal}>
        <OpplysningListItem>{sporsmalSvar.svar}</OpplysningListItem>
      </SykmeldingOpplysning>
    )
  );
  return <div>{sporsmal}</div>;
};

interface UtdypendeOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const UtdypendeOpplysninger = (
  utdypendeOpplysningerProps: UtdypendeOpplysningerProps
) => {
  const { sykmelding } = utdypendeOpplysningerProps;
  const utdypendeOpplysninger = sykmelding.utdypendeOpplysninger;
  return (
    utdypendeOpplysninger && (
      <SykmeldingSeksjon tittel={texts.title}>
        {Object.entries(utdypendeOpplysninger).map(
          ([key, opplysningGruppe]) => (
            <OpplysningsGruppe key={key} opplysningGruppe={opplysningGruppe} />
          )
        )}
      </SykmeldingSeksjon>
    )
  );
};

export default UtdypendeOpplysninger;
