import { TextField, TextFieldProps } from "@navikt/ds-react";
import React from "react";

export const MAX_LENGTH_STED = 200;

const texts = {
  label: "Sted",
  description: "F.eks: På arbeidsplassen",
};

const DialogmoteSted = (
  props: Omit<TextFieldProps, "label" | "description" | "maxLength" | "size">
) => (
  <TextField
    type="text"
    size="small"
    maxLength={MAX_LENGTH_STED}
    label={texts.label}
    description={texts.description}
    {...props}
  />
);

export default DialogmoteSted;
