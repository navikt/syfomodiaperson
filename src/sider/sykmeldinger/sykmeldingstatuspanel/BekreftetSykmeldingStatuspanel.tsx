import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { Frilansersporsmal } from "./SykmeldingStatuspanelOpplysning";
import { tilStorForbokstav } from "@/utils";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  tittel: "Sykmeldt fra",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av den sykmeldte",
  sendt: "Send til arbeidsgiver",
  utgaatt: "Ikke brukt på nett",
  bekreftet: "Bekreftet av den sykmeldte",

  status: {
    tittel: "Status",
    frilanser: ["Jeg er frilanser", "jobb som frilanser"],
    arbeidstaker: ["Jeg er ansatt", "jobb hos en arbeidsgiver"],
    arbeidsledig: "Jeg er arbeidsledig",
    naeringsdrivende: [
      "Jeg er selvstendig næringsdrivende",
      "jobb som selvstendig næringsdrivende",
    ],
    annet: ["Annet", "Jeg finner ingenting som passer for meg"],
    arbeidstakerAnnenArbeidsgiver: "jobb hos en annen arbeidsgiver",
    default: "Velg situasjon",
  },
};

const textArbeidssituasjon = (arbeidssituasjon: string) => {
  switch (arbeidssituasjon) {
    case "frilanser":
      return texts.status.frilanser[0];
    case "frilanser.2":
      return texts.status.frilanser[1];
    case "arbeidstaker":
      return texts.status.arbeidstaker[0];
    case "arbeidstaker.2":
      return texts.status.arbeidstaker[1];
    case "arbeidsledig":
    case "arbeidsledig.2":
      return texts.status.arbeidsledig;
    case "naeringsdrivende":
      return texts.status.naeringsdrivende[0];
    case "naeringsdrivende.2":
      return texts.status.naeringsdrivende[1];
    case "annet":
      return texts.status.annet[0];
    case "annet.2":
      return texts.status.annet[1];
    case "arbeidstaker-annen-arbeidsgiver.2":
      return texts.status.arbeidstakerAnnenArbeidsgiver;
    case "default":
    default:
      return texts.status.default;
  }
};

const textStatus = (status: SykmeldingStatus) => {
  switch (status) {
    case "AVBRUTT":
      return texts.avbrutt;
    case "SENDT":
      return texts.sendt;
    case "UTGAATT":
      return texts.utgaatt;
    case "BEKREFTET":
      return texts.bekreftet;
    default:
      return "";
  }
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function BekreftetSykmeldingStatuspanel({ sykmelding }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="mb-5">
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.status.tittel}
        </Heading>
        <BodyLong size="small">
          {textStatus(sykmelding.status)} –{" "}
          {tilLesbarDatoMedArstall(sykmelding.sendtdato)}
        </BodyLong>
      </div>
      <div className="mb-5">
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.tittel}
        </Heading>
        <BodyLong size="small">
          {tilStorForbokstav(
            textArbeidssituasjon(
              `${sykmelding.valgtArbeidssituasjon?.toLowerCase()}.2`
            )
          )}
        </BodyLong>
      </div>
      <Frilansersporsmal sykmelding={sykmelding} />
    </div>
  );
}
