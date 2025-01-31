import React, { ReactNode } from "react";
import { Heading } from "@navikt/ds-react";

interface Props {
  tittel: string;
  children: ReactNode;
}

export function SykmeldingSeksjon({ tittel, children }: Props) {
  return (
    <div className={"last-of-type:m-0 last-of-type:border-0"}>
      <Heading level={"3"} size={"medium"} className={"mt-5 mb-5"}>
        {tittel}
      </Heading>
      {children}
    </div>
  );
}
