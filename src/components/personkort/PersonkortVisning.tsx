import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { PersonkortLege } from "./PersonkortLege";
import { PersonkortLedere } from "./ledere/PersonkortLedere";
import { PersonkortSykmeldt } from "./PersonkortSykmeldt";
import { PersonkortEnhet } from "./PersonkortEnhet";
import { PersonkortSikkerhetstiltak } from "@/components/personkort/PersonkortSikkerhetstiltak";
import { ReactNode } from "react";

interface Props {
  visning: string;
}

export function PersonkortVisning({ visning }: Props) {
  const { LEGE, LEDER, ENHET, SIKKERHETSTILTAK } = PERSONKORTVISNING_TYPE;

  function visningType(): ReactNode {
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
