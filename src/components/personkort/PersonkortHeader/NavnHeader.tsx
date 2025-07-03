import { Heading, Tooltip } from "@navikt/ds-react";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

interface Props {
  navnSykmeldt: string;
  fodselsdato: string | null;
}

function hentBrukersAlderFraFodselsdato(fodselsdato: string | null) {
  if (!fodselsdato) return null;
  const dagensDato = new Date();
  const fodselsdatoDate = new Date(fodselsdato);
  const fodselsDatoIAr = new Date(fodselsdatoDate);
  fodselsDatoIAr.setFullYear(dagensDato.getFullYear());
  if (dagensDato.getTime() < fodselsDatoIAr.getTime()) {
    return dagensDato.getFullYear() - fodselsdatoDate.getFullYear() - 1;
  }
  return dagensDato.getFullYear() - fodselsdatoDate.getFullYear();
}

export function NavnHeader({ navnSykmeldt, fodselsdato }: Props) {
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();

  return (
    <div className="flex items-center">
      <Heading size="xsmall" level="3">
        {`${navnSykmeldt} (${hentBrukersAlderFraFodselsdato(fodselsdato)} år)`}
      </Heading>
      {hasGjentakendeSykefravar && (
        <Tooltip content={"Gjentatt sykefravær"}>
          <ArrowsCirclepathIcon className="ml-2" />
        </Tooltip>
      )}
    </div>
  );
}
