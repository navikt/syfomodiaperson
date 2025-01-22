import { TextField, TextFieldProps } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Klokkeslett",
};

const DialogmoteKlokkeslett = (
  props: Omit<TextFieldProps, "label" | "size">
) => (
  <TextField
    type="time"
    autoComplete="off"
    size="small"
    label={texts.label}
    {...props}
  />
);

export default DialogmoteKlokkeslett;
