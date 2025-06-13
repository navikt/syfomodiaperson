import React, { useState } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import NyVurdering from "@/sider/arbeidsuforhet/NyVurdering";
import ForhandsvarselSendt from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import SendForhandsvarselSkjema from "./SendForhandsvarselSkjema";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import VelgVurdering from "@/sider/arbeidsuforhet/VelgVurdering";

export default function Arbeidsuforhet() {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const { toggles } = useFeatureToggles();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] =
    useState<boolean>(false);

  return (
    <div className="mb-2">
      {showStartetVurdering || isForhandsvarsel ? (
        isForhandsvarsel ? (
          <ForhandsvarselSendt forhandsvarsel={sisteVurdering} />
        ) : toggles.isInnstillingUtenForhandsvarselArbeidsuforhetEnabled ? (
          <VelgVurdering />
        ) : (
          <SendForhandsvarselSkjema />
        )
      ) : (
        <NyVurdering handleClick={() => setShowStartetVurdering(true)} />
      )}
    </div>
  );
}
