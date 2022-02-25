import React, { ReactElement } from "react";
import SykmeldingUtdrag from "./soknad-felles/SykmeldingUtdrag";
import {
  SoknadstypeDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";

interface SykmeldingUtdragContainerProps {
  soknad: SykepengesoknadDTO;
}

export const SykmeldingUtdragContainer = ({
  soknad,
}: SykmeldingUtdragContainerProps): ReactElement => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const sykmelding = sykmeldinger.find((s) => {
    return s.id === soknad.sykmeldingId;
  });

  return sykmelding &&
    soknad &&
    (!soknad.soknadstype ||
      soknad.soknadstype === SoknadstypeDTO.ARBEIDSTAKERE) ? (
    <SykmeldingUtdrag sykmelding={sykmelding} />
  ) : (
    <></>
  );
};
