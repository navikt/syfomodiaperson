import React, { ReactNode } from "react";
import "@navikt/ds-css";
import { FieldReadOnly } from "@/components/FieldReadOnly";

interface Props {
  tittel: string;
  children?: ReactNode;
  isSubopplysning?: boolean;
}

export default function SykmeldingOpplysning({
  tittel,
  children,
  isSubopplysning = false,
}: Props) {
  return (
    <FieldReadOnly
      label={tittel}
      className={`${isSubopplysning ? "ml-6" : ""}`}
    >
      {children}
    </FieldReadOnly>
  );
}
