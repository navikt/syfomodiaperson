import React from "react";
import { TilbakeIArbeidCheckboxMedSporsmalOgDato } from "./TilbakeIArbeidCheckboxMedSporsmalOgDato";
import { FriskmeldingDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort } from "@navikt/ds-react";

const tekster = {
  header: "8 uker: Pasient uten arbeidsgiver, utdypende opplysninger",
  retur: "Jeg antar at pasienten på sikt kan komme tilbake i arbeid",
  returDatoSporsmal: "Anslå når du tror dette kan skje",
  usikkerCheckboxLabel:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid",
  usikkerDatoSporsmal: "Når antar du å kunne gi tilbakemelding på dette?",
};

interface Props {
  friskmelding: FriskmeldingDTO;
}

export function TilbakeIArbeidUtenArbeidsgiver({ friskmelding }: Props) {
  const antarTilbakeIArbeid = friskmelding.utenArbeidsgiverAntarTilbakeIArbeid;

  return (
    <div>
      <BodyShort size="small" weight="semibold">
        {tekster.header}
      </BodyShort>
      {antarTilbakeIArbeid ? (
        <TilbakeIArbeidCheckboxMedSporsmalOgDato
          checkboxLabel={tekster.retur}
          sporsmal={tekster.returDatoSporsmal}
          returDato={friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato}
        />
      ) : (
        <TilbakeIArbeidCheckboxMedSporsmalOgDato
          checkboxLabel={tekster.usikkerCheckboxLabel}
          sporsmal={tekster.usikkerDatoSporsmal}
          returDato={friskmelding.utenArbeidsgiverTilbakemelding}
        />
      )}
    </div>
  );
}
