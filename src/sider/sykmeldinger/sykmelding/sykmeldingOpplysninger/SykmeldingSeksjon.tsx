import React, { ReactNode } from "react";
import { Heading } from "@navikt/ds-react";

interface SykmeldingSeksjonProps {
  tittel: string;
  children?: ReactNode;
}

export function SykmeldingSeksjon(
  sykmeldingCheckboxProps: SykmeldingSeksjonProps
) {
  const { tittel, children } = sykmeldingCheckboxProps;
  return (
    <div className={"last-of-type:m-0 last-of-type:border-0"}>
      <Heading level={"3"} size={"medium"} className={"mt-5 mb-5"}>
        {tittel}
      </Heading>
      {children}
    </div>
  );
}
