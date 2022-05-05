import React, { ReactElement } from "react";
import { Field } from "react-final-form";
import Fritekst from "@/components/Fritekst";

export const texts = {
  beskrivelseLabel: "Beskrivelse (valgfri)",
};

export const dialogmoteunntakSkjemaBeskrivelseFieldName = "beskrivelse";
export const dialogmoteunntakSkjemaBeskrivelseMaxLength = 2000;

const DialogmoteunntakSkjemaBeskrivelse = (): ReactElement => {
  return (
    <Field<string> name={dialogmoteunntakSkjemaBeskrivelseFieldName}>
      {({ input, meta }) => (
        <Fritekst
          size="medium"
          maxLength={dialogmoteunntakSkjemaBeskrivelseMaxLength}
          label={texts.beskrivelseLabel}
          feil={meta.submitFailed && meta.error}
          id={dialogmoteunntakSkjemaBeskrivelseFieldName}
          {...input}
        />
      )}
    </Field>
  );
};

export default DialogmoteunntakSkjemaBeskrivelse;
