import { Textarea, TextareaProps } from "nav-frontend-skjema";
import React from "react";

export type FritekstSize = "medium" | "stor" | "ekstra-stor";
type FritekstProps = {
  size: FritekstSize;
} & TextareaProps;

const Fritekst = ({ size, ...rest }: FritekstProps) => (
  <Textarea {...rest} textareaClass={textAreaClass(size)} />
);

const textAreaClass = (size: FritekstSize) => {
  switch (size) {
    case "medium":
      return "fritekstMedium";
    case "stor":
      return "fritekstStor";
    case "ekstra-stor":
      return "fritekstEkstraStor";
    default:
      return undefined;
  }
};

export default Fritekst;
