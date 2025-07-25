import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykmeldingCheckboxForFelt } from "../SykmeldingCheckboxForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import SykmeldingOpplysningForFelt from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/SykmeldingOpplysningForFelt";

const texts = {
  title: "Friskmelding/prognose",
  returArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme tilbake til samme arbeidsgiver",
  returArbeidsgiverDato: "Anslå når du tror dette kan skje",
  returArbeidsgiverAnnen:
    "Jeg antar at pasienten på sikt kan komme i arbeid hos annen arbeidsgiver",
  returUsikker:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid hos egen eller annen arbeidsgiver",
  returUsikkerDato: "Når antar du å kunne gi tilbakemelding på dette?",
  returUtenArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme tilbake i arbeid",
  returUtenArbeidsgiverDato: "Anslå når du tror dette kan skje",
  returUtenArbeidsgiverUsikker:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid",
  returUtenArbeidsgiverUsikkerDato:
    "Når antar du å kunne gi tilbakemelding på dette?",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function Friskmelding(friskmeldingProps: Props) {
  const { sykmelding } = friskmeldingProps;
  const visSeksjon =
    sykmelding.friskmelding.antarReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antarReturAnnenArbeidsgiver ||
    sykmelding.friskmelding.tilbakemeldingReturArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding;

  if (!visSeksjon) {
    return <div />;
  }
  return (
    <SykmeldingSeksjon tittel={texts.title}>
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="antarReturSammeArbeidsgiver"
        tekst={texts.returArbeidsgiver}
      />
      {!sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ? null : (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt={"antattDatoReturSammeArbeidsgiver"}
          tittel={texts.returArbeidsgiverDato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver
          )}
          isSubopplysning={true}
        />
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="antarReturAnnenArbeidsgiver"
        tekst={texts.returArbeidsgiverAnnen}
        className="blokk-s"
      />
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="tilbakemeldingReturArbeid"
        tekst={texts.returUsikker}
      />
      {!sykmelding.friskmelding.tilbakemeldingReturArbeid ? null : (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt={"tilbakemeldingReturArbeid"}
          tittel={texts.returUsikkerDato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.friskmelding.tilbakemeldingReturArbeid
          )}
          isSubopplysning={true}
        />
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="utenArbeidsgiverAntarTilbakeIArbeid"
        tekst={texts.returUtenArbeidsgiver}
        className="blokk-s"
      />
      {!(
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid &&
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
      ) ? null : (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt={"utenArbeidsgiverAntarTilbakeIArbeid"}
          tittel={texts.returUtenArbeidsgiverDato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
          )}
          isSubopplysning={true}
        />
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="utenArbeidsgiverTilbakemelding"
        tekst={texts.returUtenArbeidsgiverUsikker}
        className="blokk-s"
      />
      {!sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ? null : (
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt={"utenArbeidsgiverTilbakemelding"}
          tittel={texts.returUtenArbeidsgiverUsikkerDato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.friskmelding.utenArbeidsgiverTilbakemelding
          )}
          isSubopplysning={true}
        />
      )}
    </SykmeldingSeksjon>
  );
}
