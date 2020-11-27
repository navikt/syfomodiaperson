import React from "react";
import { SykmeldingCheckbox } from "../components/sykmelding/sykmeldingOpplysninger/SykmeldingCheckbox";

export const getSykmeldingCheckbox = (
  sykmeldingBolk,
  felt,
  tekst,
  className
) => {
  if (sykmeldingBolk[felt]) {
    return (
      <SykmeldingCheckbox
        tekst={tekst}
        jsClassName={felt}
        className={className}
      />
    );
  }
  return null;
};
