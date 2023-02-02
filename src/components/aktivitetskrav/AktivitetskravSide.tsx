import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AktivitetskravVurderingAlert } from "@/components/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import {
  aktivitetskravVurderingerForOppfolgingstilfelle,
  oppfolgingstilfelleForAktivitetskrav,
} from "@/utils/aktivitetskravUtils";
import { NoOppfolgingstilfelleAktivitetskravAlert } from "@/components/aktivitetskrav/NoOppfolgingstilfelleAktivitetskravAlert";

export const AktivitetskravSide = () => {
  const { tilfellerDescendingStart, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskravTilVurdering = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT
  );
  const oppfolgingstilfelle =
    aktivitetskravTilVurdering &&
    oppfolgingstilfelleForAktivitetskrav(
      aktivitetskravTilVurdering,
      tilfellerDescendingStart
    );
  const sisteVurdering = oppfolgingstilfelle
    ? aktivitetskravVurderingerForOppfolgingstilfelle(
        data,
        oppfolgingstilfelle
      )[0]
    : aktivitetskravTilVurdering?.vurderinger[0];

  return (
    <>
      {!hasActiveOppfolgingstilfelle && (
        <NoOppfolgingstilfelleAktivitetskravAlert />
      )}
      {sisteVurdering && (
        <AktivitetskravVurderingAlert vurdering={sisteVurdering} />
      )}
      <VurderAktivitetskrav
        aktivitetskrav={aktivitetskravTilVurdering}
        oppfolgingstilfelle={oppfolgingstilfelle}
      />
      <AktivitetskravPanel>
        <UtdragFraSykefravaeret />
      </AktivitetskravPanel>
      <AktivitetskravHistorikk />
    </>
  );
};
