import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { BodyShort, Checkbox, Heading } from "@navikt/ds-react";

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

  return (
    <SykmeldingSeksjon tittel={texts.title}>
      {sykmelding.friskmelding.antarReturSammeArbeidsgiver && (
        <Checkbox checked readOnly size="small">
          {texts.returArbeidsgiver}
        </Checkbox>
      )}
      {sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver && (
        <div className="mb-5 ml-6">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.returArbeidsgiverDato}
          </Heading>
          <BodyShort size="small">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver
            )}
          </BodyShort>
        </div>
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
          <div className="mb-5 ml-6">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.returUsikkerDato}
            </Heading>
            <BodyShort size="small">
              {tilLesbarDatoMedArstall(
                sykmelding.friskmelding.tilbakemeldingReturArbeid
              )}
            </BodyShort>
          </div>
        </>
      )}
      {sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid && (
        <>
          <Checkbox checked readOnly size="small">
            {texts.returUtenArbeidsgiver}
          </Checkbox>
          {sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato && (
            <div className="mb-5 ml-6">
              <Heading level="4" size="xsmall" className="mb-1">
                {texts.returUtenArbeidsgiverDato}
              </Heading>
              <BodyShort size="small">
                {tilLesbarDatoMedArstall(
                  sykmelding.friskmelding
                    .utenArbeidsgiverAntarTilbakeIArbeidDato
                )}
              </BodyShort>
            </div>
          )}
        </>
      )}
      {sykmelding.friskmelding.utenArbeidsgiverTilbakemelding && (
        <>
          <Checkbox checked readOnly size="small">
            {texts.returUtenArbeidsgiverUsikker}
          </Checkbox>
          <div className="mb-5 ml-6">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.returUtenArbeidsgiverUsikkerDato}
            </Heading>
            <BodyShort size="small">
              {tilLesbarDatoMedArstall(
                sykmelding.friskmelding.utenArbeidsgiverTilbakemelding
              )}
            </BodyShort>
          </div>
        </>
      )}
    </SykmeldingSeksjon>
  );
}
