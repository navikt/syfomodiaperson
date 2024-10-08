import { hentBrukersAlderFraFnr } from "@/utils/fnrUtils";
import { Heading, Tooltip } from "@navikt/ds-react";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

interface Props {
  navnSykmeldt: string;
  personident: string;
}

export function NavnHeader({ navnSykmeldt, personident }: Props) {
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();

  return (
    <div className="flex items-center">
      <Heading size="xsmall" level="3">
        {`${navnSykmeldt} (${hentBrukersAlderFraFnr(personident)} år)`}
      </Heading>
      {hasGjentakendeSykefravar && (
        <Tooltip content={"Gjentatt sykefravær"}>
          <ArrowsCirclepathIcon className="ml-2" />
        </Tooltip>
      )}
    </div>
  );
}
