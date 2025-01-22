import { Textarea, TextareaProps } from "@navikt/ds-react";
import React from "react";

const TextareaField = (props: TextareaProps) => (
  <Textarea className="mb-4" size="small" minRows={4} {...props} />
);

export default TextareaField;
