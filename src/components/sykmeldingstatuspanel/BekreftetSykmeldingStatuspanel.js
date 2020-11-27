import React from "react";
import {
  sykmelding as sykmeldingPt,
  tilLesbarDatoMedArstall,
} from "@navikt/digisyfo-npm";
import { Frilansersporsmal } from "./SykmeldingStatuspanelOpplysning";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../Statuspanel";
import AngreBekreftSykmelding from "../../connected-components/AngreBekreftSykmelding";
import { tilStorForbokstav } from "../../utils";

const texts = {
  tittel: "Jeg er sykmeldt fra",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av deg",
  sendt: "Send til arbeidsgiver",
  utgaatt: "Ikke brukt på nett",
  bekreftet: "Bekreftet av deg",

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

const textArbeidssituasjon = (arbeidssituasjon) => {
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

const textStatus = (status) => {
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

const BekreftetSykmeldingStatuspanel = ({ sykmelding }) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status.tittel}>
          <p className="js-status">
            {textStatus(sykmelding.status)} –{" "}
            {tilLesbarDatoMedArstall(sykmelding.sendtdato)}
          </p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.tittel}>
          <p className="js-arbeidssituasjon">
            {tilStorForbokstav(
              textArbeidssituasjon(
                `${sykmelding.valgtArbeidssituasjon.toLowerCase()}.2`
              )
            )}
          </p>
        </StatusNokkelopplysning>
        <Frilansersporsmal sykmelding={sykmelding} />
      </Statusopplysninger>
      <AngreBekreftSykmelding sykmelding={sykmelding} />
    </Statuspanel>
  );
};

BekreftetSykmeldingStatuspanel.propTypes = {
  sykmelding: sykmeldingPt,
};

export default BekreftetSykmeldingStatuspanel;
