import React from "react";
import { SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Select } from "@navikt/ds-react";
import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { Field } from "react-final-form";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { Toggles } from "../../../../server/unleash";

const text = {
  label: "Hvilken meldingstype ønsker du å sende?",
  defaultOption: "Velg meldingstype",
};

const field = "type";

const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
  <option value={type}>{meldingTypeTexts[type]}</option>
);

export const SelectMeldingType = ({ toggles }: { toggles: Toggles }) => (
  <Field<string> name={field}>
    {({ input, meta }) => (
      <>
        <Select
          id={field}
          label={text.label}
          onChange={(e) => input.onChange(e.target.value)}
          defaultValue={""}
        >
          <option value="">{text.defaultOption}</option>
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
          />
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
          />
          {toggles.isMeldingsTypeMeldingFraNAVEnabled && (
            <MeldingTypeOption type={MeldingType.HENVENDELSE_MELDING_FRA_NAV} />
          )}
        </Select>
        <SkjemaelementFeilmelding>
          {meta.submitFailed && meta.error}
        </SkjemaelementFeilmelding>
      </>
    )}
  </Field>
);
