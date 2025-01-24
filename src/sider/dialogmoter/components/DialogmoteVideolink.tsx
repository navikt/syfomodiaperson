import { TextField, TextFieldProps } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Lenke til videomøte (valgfritt)",
};

const DialogmoteVideolink = (props: Omit<TextFieldProps, "label" | "size">) => (
  <TextField type="text" size="small" label={texts.label} {...props} />
);

export default DialogmoteVideolink;
