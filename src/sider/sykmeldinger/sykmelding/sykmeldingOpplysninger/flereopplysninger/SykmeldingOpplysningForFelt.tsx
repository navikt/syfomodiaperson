import React from "react";
import SykmeldingOpplysning from "./SykmeldingOpplysning";

interface Props {
  sykmeldingBolk: { [key: string]: any };
  felt: string;
  tittel: string;
  opplysning?: string;
  Overskrift?: keyof JSX.IntrinsicElements;
}

export const SykmeldingOpplysningForFelt = ({
  sykmeldingBolk,
  felt,
  tittel,
  opplysning,
  Overskrift = "h5",
}: Props) =>
  sykmeldingBolk[felt] ? (
    <SykmeldingOpplysning tittel={tittel} Overskrift={Overskrift}>
      <p className={`opplysning__verdi js-${felt}`}>
        {opplysning || sykmeldingBolk[felt]}
      </p>
    </SykmeldingOpplysning>
  ) : null;
