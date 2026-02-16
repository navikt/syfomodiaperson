import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { Frilansersporsmal } from "./SykmeldingStatuspanelOpplysning";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { tilStorForbokstav } from "@/utils";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

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

interface BekreftetSykmeldingStatuspanelProps {
  sykmelding: SykmeldingOldFormat;
}

const BekreftetSykmeldingStatuspanel = (
  bekreftetSykmeldingStatuspanelProps: BekreftetSykmeldingStatuspanelProps
): ReactElement => {
  const { sykmelding } = bekreftetSykmeldingStatuspanelProps;
  return (
    <Statuspanel>
      <Statusopplysninger>
        <Nokkelopplysning
          label={texts.status.tittel}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>
            {textStatus(sykmelding.status)} –{" "}
            {tilLesbarDatoMedArstall(sykmelding.sendtdato)}
          </p>
        </Nokkelopplysning>
        <Nokkelopplysning
          label={texts.tittel}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>
            {tilStorForbokstav(
              textArbeidssituasjon(
                `${sykmelding.valgtArbeidssituasjon?.toLowerCase()}.2`
              )
            )}
          </p>
        </Nokkelopplysning>
        <Frilansersporsmal sykmelding={sykmelding} />
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default BekreftetSykmeldingStatuspanel;
