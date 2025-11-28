import { TextField, TextFieldProps } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Lenke til videomøte (valgfritt)",
};

export default function DialogmoteVideolink(
  props: Omit<TextFieldProps, "label" | "size">
) {
  return <TextField type="text" size="small" label={texts.label} {...props} />;
}
