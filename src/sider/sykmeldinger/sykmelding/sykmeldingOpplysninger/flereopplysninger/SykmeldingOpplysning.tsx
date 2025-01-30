import React, { ReactNode } from "react";
import "@navikt/ds-css";
import { FieldReadOnly } from "@/components/FieldReadOnly";

interface SykmeldingOpplysningProps {
  tittel: string;
  children?: ReactNode;
  isSubopplysning?: boolean;
}

export default function SykmeldingOpplysning(
  sykmeldingOpplysningProps: SykmeldingOpplysningProps
) {
  const {
    tittel,
    children,
    isSubopplysning = false,
  } = sykmeldingOpplysningProps;

  return (
    <FieldReadOnly label={tittel} className={`${isSubopplysning && "ml-6"}`}>
      {children}
    </FieldReadOnly>
  );
}
