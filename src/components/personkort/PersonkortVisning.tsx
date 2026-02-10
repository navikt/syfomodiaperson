import React from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { PersonkortLege } from "./PersonkortLege";
import { PersonkortLedere } from "./ledere/PersonkortLedere";
import { PersonkortSykmeldt } from "./PersonkortSykmeldt";
import { PersonkortEnhet } from "./PersonkortEnhet";
import { PersonkortSikkerhetstiltak } from "@/components/personkort/PersonkortSikkerhetstiltak";

interface Props {
  visning: string;
}

export function PersonkortVisning({ visning }: Props) {
  const { LEGE, LEDER, ENHET, SIKKERHETSTILTAK } = PERSONKORTVISNING_TYPE;

  function visningType(): React.ReactNode {
    switch (visning) {
      case LEGE:
        return <PersonkortLege />;
      case LEDER:
        return <PersonkortLedere />;
      case ENHET:
        return <PersonkortEnhet />;
      case SIKKERHETSTILTAK:
        return <PersonkortSikkerhetstiltak />;
      default:
        return <PersonkortSykmeldt />;
    }
  }

  return (
    <div aria-live="polite" className="personkortVisning">
      {visningType()}
    </div>
  );
}
