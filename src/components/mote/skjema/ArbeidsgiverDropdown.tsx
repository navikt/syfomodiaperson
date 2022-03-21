import React from "react";
import { Select } from "nav-frontend-skjema";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver:
    "Det er ikke registrert noen nærmeste leder på denne arbeidstakeren. Du må sende innkallingen fra Arena.",
};

interface ArbeidsgiverDropdownProps {
  velgArbeidsgiver(orgNr: string): void;
  virksomheter: string[];
  label?: string;
  id?: string;
}

const removeDuplicates = (virksomheter: string[]): string[] => {
  return virksomheter.filter((virksomhet, index) => {
    return (
      virksomheter.findIndex((virksomhet2) => {
        return virksomhet2 === virksomhet;
      }) === index
    );
  });
};
interface VirksomhetOptionProps {
  virksomhetsnummer: string;
}
const VirksomhetOption = ({ virksomhetsnummer }: VirksomhetOptionProps) => {
  const { data } = useVirksomhetQuery(virksomhetsnummer);
  const virksomhetsnavn =
    data?.navn || `Fant ikke virksomhetsnavn for ${virksomhetsnummer}`;
  return <option value={virksomhetsnummer}>{virksomhetsnavn}</option>;
};

const ArbeidsgiverDropdown = ({
  velgArbeidsgiver,
  virksomheter,
  label,
  id,
}: ArbeidsgiverDropdownProps) =>
  virksomheter.length !== 0 ? (
    <Select
      id={id}
      label={label}
      onChange={(e) => {
        velgArbeidsgiver(e.target.value);
      }}
    >
      <option value="VELG">{texts.chooseArbeidsgiver}</option>
      {removeDuplicates(virksomheter).map((virksomhet, idx) => (
        <VirksomhetOption virksomhetsnummer={virksomhet} key={idx} />
      ))}
    </Select>
  ) : (
    <AlertstripeFullbredde type="advarsel">
      {texts.noArbeidsgiver}
    </AlertstripeFullbredde>
  );

export default ArbeidsgiverDropdown;
