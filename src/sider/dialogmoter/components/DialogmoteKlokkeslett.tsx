import { TextField, TextFieldProps } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Klokkeslett",
};

export default function DialogmoteKlokkeslett(
  props: Omit<TextFieldProps, "label" | "size">
) {
  return (
    <TextField
      type="time"
      autoComplete="off"
      size="small"
      label={texts.label}
      {...props}
    />
  );
}
