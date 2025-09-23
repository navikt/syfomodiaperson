import React, { ReactElement } from "react";
import SykmeldingUtdrag from "./soknad-felles/SykmeldingUtdrag";
import {
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";

interface Props {
  soknad: SykepengesoknadDTO;
}

export const SykmeldingUtdragContainer = ({
  soknad,
}: Props): ReactElement | null => {
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const sykmelding = sykmeldinger.find((s) => {
    return s.id === soknad.sykmeldingId;
  });
  const isVisible =
    !!sykmelding &&
    soknad &&
    (!soknad.soknadstype || soknad.soknadstype === Soknadstype.ARBEIDSTAKERE);

  return isVisible ? <SykmeldingUtdrag sykmelding={sykmelding} /> : null;
};
