import React from "react";
import { BodyShort } from "@navikt/ds-react";

interface Props {
  keyword: string;
  value: string;
}

export function SyketilfelleSummaryElement({ keyword, value }: Props) {
  return (
    <BodyShort size="small" className="font-normal">
      <span>{keyword}</span>
      <b>{value}</b>
    </BodyShort>
  );
}
