import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import IkkeInnsendtSoknad from "../soknad-felles/IkkeInnsendtSoknad";
import SendtSoknadSelvstendigStatuspanel from "./SendtSoknadSelvstendigStatuspanel";
import AvbruttSoknadSelvstendigStatuspanel from "./AvbruttSoknadSelvstendigStatuspanel";
import SykmeldingUtdragForSelvstendige from "./SykmeldingutdragForSelvstendige";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  sideTittel: "Søknad om sykepenger",
  oppsummering: "Oppsummering",
};

interface Props {
  soknad: SykepengesoknadDTO;
  sykmelding?: SykmeldingOldFormat;
}

export default function SykepengesoknadSelvstendig({
  soknad,
  sykmelding,
}: Props): ReactElement {
  switch (soknad.status) {
    case Soknadstatus.NY:
    case Soknadstatus.FREMTIDIG: {
      return <IkkeInnsendtSoknad />;
    }
    case Soknadstatus.AVBRUTT: {
      return (
        <div>
          <Heading level="1" size="large">
            {texts.sideTittel}
          </Heading>
          <AvbruttSoknadSelvstendigStatuspanel soknad={soknad} />
          {sykmelding?.sporsmal && (
            <SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />
          )}
          <TilbakeTilSoknader />
        </div>
      );
    }
    default: {
      return (
        <div>
          <Heading level="1" size="large">
            {texts.sideTittel}
          </Heading>
          <SendtSoknadSelvstendigStatuspanel soknad={soknad} />
          {sykmelding?.sporsmal && (
            <SykmeldingUtdragForSelvstendige sykmelding={sykmelding} erApen />
          )}
          <SpeilingEkspanderbartPanel tittel={texts.oppsummering} defaultOpen>
            <Oppsummeringsvisning soknad={soknad} />
          </SpeilingEkspanderbartPanel>
          <TilbakeTilSoknader />
        </div>
      );
    }
  }
}
