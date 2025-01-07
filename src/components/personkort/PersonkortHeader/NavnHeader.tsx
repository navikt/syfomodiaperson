import { Heading, Tooltip } from "@navikt/ds-react";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { hentBrukersFoedseldatoFraFnr } from "@/utils/fnrUtils";

interface Props {
  navnSykmeldt: string;
  personident: string;
}

export function hentBrukersAlderFraFnr(fnr: string) {
  const dagensDato = new Date();
  const fodselsdato = hentBrukersFoedseldatoFraFnr(fnr);

  if (fodselsdato) {
    const fodselsDatoIAr = new Date(fodselsdato);
    fodselsDatoIAr.setFullYear(dagensDato.getFullYear());
    if (fodselsdato && dagensDato.getTime() < fodselsDatoIAr.getTime()) {
      return dagensDato.getFullYear() - fodselsdato.getFullYear() - 1;
    }
    return fodselsdato && dagensDato.getFullYear() - fodselsdato.getFullYear();
  }
  return null;
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
