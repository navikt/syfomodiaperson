import React from "react";
import { Select } from "nav-frontend-skjema";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";
import { ledereSortertPaaNavnOgOrganisasjonsnavn } from "@/utils/ledereUtils";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
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
}: ArbeidsgiverDropdownProps) => (
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
);

export default ArbeidsgiverDropdown;
