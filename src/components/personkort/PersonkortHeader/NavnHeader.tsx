import { Heading, Tooltip } from "@navikt/ds-react";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

interface Props {
  navnSykmeldt: string;
  alder: number | null;
}

export function NavnHeader({ navnSykmeldt, alder }: Props) {
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();

  return (
    <div className="flex items-center">
      <Heading size="xsmall" level="3">
        {navnSykmeldt}
        {alder != null && ` (${alder} år)`}
      </Heading>
      {hasGjentakendeSykefravar && (
        <Tooltip content={"Gjentatt sykefravær"}>
          <ArrowsCirclepathIcon className="ml-2" />
        </Tooltip>
      )}
    </div>
  );
}
