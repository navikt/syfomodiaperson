import React from "react";
import { TilbakeIArbeidCheckboxMedSporsmalOgDato } from "./TilbakeIArbeidCheckboxMedSporsmalOgDato";
import { FriskmeldingDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";

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
    <div className="sykmeldingMotebehovVisning__tilbakeIArbeid--utenArbeidsgiver">
      <h5 className="undertittel">{tekster.header}</h5>
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
