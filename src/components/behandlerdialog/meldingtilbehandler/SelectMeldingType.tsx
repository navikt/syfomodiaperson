import React from "react";
import { Select } from "nav-frontend-skjema";
import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";

const text = {
  tilleggsopplysinger: "Tilleggsopplysninger L8",
  legeerklaring: "Legeerklæring L46",
  label: "Velg meldingstype",
  defaultOption: "---",
};

interface SelectMeldingTypeProps {
  selectedMeldingType?: MeldingType;
  onSelect: (MeldingType) => void;
}

export const SelectMeldingType = ({
  selectedMeldingType,
  onSelect,
}: SelectMeldingTypeProps) => {
  console.log(selectedMeldingType);
  return (
    <Select label={text.label} onChange={(e) => onSelect(e.target.value)}>
      <option value="">{text.defaultOption}</option>
      <option value={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}>
        {text.tilleggsopplysinger}
      </option>
      <option value={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}>
        {text.legeerklaring}
      </option>
    </Select>
  );
};
