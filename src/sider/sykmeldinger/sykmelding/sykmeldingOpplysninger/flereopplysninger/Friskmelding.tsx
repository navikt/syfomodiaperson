import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import SykmeldingOpplysningForFelt from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/SykmeldingOpplysningForFelt";
import { Checkbox } from "@navikt/ds-react";

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
      {sykmelding.friskmelding.antarReturSammeArbeidsgiver && (
        <Checkbox checked readOnly size="small">
          {texts.returArbeidsgiver}
        </Checkbox>
      )}

      {sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver && (
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
      {sykmelding.friskmelding.antarReturAnnenArbeidsgiver && (
        <Checkbox checked readOnly size="small">
          {texts.returArbeidsgiverAnnen}
        </Checkbox>
      )}

      {sykmelding.friskmelding.tilbakemeldingReturArbeid && (
        <>
          <Checkbox checked readOnly size="small">
            {texts.returUsikker}
          </Checkbox>
          <SykmeldingOpplysningForFelt
            sykmeldingBolk={sykmelding.friskmelding}
            felt={"tilbakemeldingReturArbeid"}
            tittel={texts.returUsikkerDato}
            opplysning={tilLesbarDatoMedArstall(
              sykmelding.friskmelding.tilbakemeldingReturArbeid
            )}
            isSubopplysning={true}
          />
        </>
      )}
      {sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid && (
        <>
          <Checkbox checked readOnly size="small">
            {texts.returUtenArbeidsgiver}
          </Checkbox>
          {sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato && (
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
        </>
      )}
      {sykmelding.friskmelding.utenArbeidsgiverTilbakemelding && (
        <>
          <Checkbox checked readOnly size="small">
            {texts.returUtenArbeidsgiverUsikker}
          </Checkbox>
          <SykmeldingOpplysningForFelt
            sykmeldingBolk={sykmelding.friskmelding}
            felt={"utenArbeidsgiverTilbakemelding"}
            tittel={texts.returUtenArbeidsgiverUsikkerDato}
            opplysning={tilLesbarDatoMedArstall(
              sykmelding.friskmelding.utenArbeidsgiverTilbakemelding
            )}
            isSubopplysning={true}
          />
        </>
      )}
    </SykmeldingSeksjon>
  );
}
