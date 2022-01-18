import React from "react";
import { Select } from "nav-frontend-skjema";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";
import { ledereSortertPaaNavnOgOrganisasjonsnavn } from "@/utils/ledereUtils";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver:
    "Det er ikke registrert noen nærmeste leder på denne arbeidstakeren. Du må sende innkallingen fra Arena.",
};

interface ArbeidsgiverDropdownProps {
  velgArbeidsgiver(orgNr: string): void;

  ledere: NarmesteLederRelasjonDTO[];
  label?: string;
  id?: string;
}

const ArbeidsgiverDropdown = ({
  velgArbeidsgiver,
  ledere,
  label,
  id,
}: ArbeidsgiverDropdownProps) =>
  ledere.length !== 0 ? (
    <Select
      id={id}
      label={label}
      onChange={(e) => {
        velgArbeidsgiver(e.target.value);
      }}
    >
      <option value="VELG">{texts.chooseArbeidsgiver}</option>
      {ledereSortertPaaNavnOgOrganisasjonsnavn(ledere).map((leder, idx) => (
        <option value={leder.virksomhetsnummer} key={idx}>
          {leder.virksomhetsnavn}
        </option>
      ))}
    </Select>
  ) : (
    <AlertstripeFullbredde type="advarsel">
      {texts.noArbeidsgiver}
    </AlertstripeFullbredde>
  );

export default ArbeidsgiverDropdown;
