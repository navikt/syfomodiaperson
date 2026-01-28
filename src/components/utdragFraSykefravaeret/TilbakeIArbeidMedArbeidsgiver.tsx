import React from "react";
import { TilbakeIArbeidCheckboxMedSporsmalOgDato } from "@/components/utdragFraSykefravaeret/TilbakeIArbeidCheckboxMedSporsmalOgDato";
import { FriskmeldingDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, Checkbox, VStack } from "@navikt/ds-react";

const tekster = {
  header: "8 uker: Pasient med arbeidsgiver, utdypende opplysninger",
  returSammeArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme tilbake til samme arbeidsgiver",
  datoSporsmal: "Anslå når du tror dette kan skje",
  returAnnenArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme i arbeid hos annen arbeidsgiver",
  usikkerDatoSporsmal: "Når antar du å kunne gi tilbakemelding på dette?",
  usikkerCheckboxLabel:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid hos egen eller annen arbeidsgiver",
};

interface Props {
  friskmelding: FriskmeldingDTO;
}

export function TilbakeIArbeidMedArbeidsgiver({ friskmelding }: Props) {
  const antarRetur =
    friskmelding.antarReturSammeArbeidsgiver ||
    friskmelding.antarReturAnnenArbeidsgiver;

  return (
    <div>
      <BodyShort size="small" weight="semibold">
        {tekster.header}
      </BodyShort>
      {antarRetur ? (
        <VStack gap="2">
          {friskmelding.antarReturSammeArbeidsgiver && (
            <TilbakeIArbeidCheckboxMedSporsmalOgDato
              checkboxLabel={tekster.returSammeArbeidsgiver}
              sporsmal={tekster.datoSporsmal}
              returDato={friskmelding.antattDatoReturSammeArbeidsgiver}
            />
          )}
          {friskmelding.antarReturAnnenArbeidsgiver && (
            <Checkbox size="small" checked readOnly>
              {tekster.returAnnenArbeidsgiver}
            </Checkbox>
          )}
        </VStack>
      ) : (
        <TilbakeIArbeidCheckboxMedSporsmalOgDato
          checkboxLabel={tekster.usikkerCheckboxLabel}
          sporsmal={tekster.usikkerDatoSporsmal}
          returDato={friskmelding.tilbakemeldingReturArbeid}
        />
      )}
    </div>
  );
}
