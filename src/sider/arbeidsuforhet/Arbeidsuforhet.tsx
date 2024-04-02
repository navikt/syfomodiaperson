import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { AvslagSent } from "@/sider/arbeidsuforhet/AvslagSent";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  getSykmeldingStartdato,
  sykmeldingerSortertNyestTilEldstPeriode,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import dayjs from "dayjs";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

const newSykmeldingAfterLastVurdering = (
  sykmeldinger: SykmeldingOldFormat[],
  latestVurdering: VurderingResponseDTO
) => {
  const sortedSykmeldinger =
    !!sykmeldinger &&
    sykmeldinger.length > 0 &&
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger);
  const newestSykmelding = sortedSykmeldinger[0];
  const startDateOfNewestSykmelding =
    !!newestSykmelding?.mulighetForArbeid?.perioder &&
    newestSykmelding?.mulighetForArbeid?.perioder.length > 0 &&
    getSykmeldingStartdato(newestSykmelding);
  const dateOfLastVurdering = latestVurdering?.createdAt;
  return (
    !!startDateOfNewestSykmelding &&
    dayjs(startDateOfNewestSykmelding).isAfter(dateOfLastVurdering)
  );
};

export const Arbeidsuforhet = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const { sykmeldinger } = useSykmeldingerQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const isOppfylt = sisteVurdering?.type === VurderingType.OPPFYLT;
  const isAvslag = sisteVurdering?.type === VurderingType.AVSLAG;
  const isSykmeldingAfterLastVurdering = newSykmeldingAfterLastVurdering(
    sykmeldinger,
    sisteVurdering
  );

  return (
    <div className="mb-2">
      {(!sisteVurdering || isOppfylt || isSykmeldingAfterLastVurdering) && (
        <SendForhandsvarselSkjema />
      )}
      {isForhandsvarsel && <ForhandsvarselSendt />}
      {!isSykmeldingAfterLastVurdering && isAvslag && <AvslagSent />}
    </div>
  );
};
