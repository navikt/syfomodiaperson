import React, { useState } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import NyVurdering from "@/sider/arbeidsuforhet/NyVurdering";
import ForhandsvarselSendt from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import SendForhandsvarselSkjema from "./SendForhandsvarselSkjema";

export default function Arbeidsuforhet() {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
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
        ) : (
          <SendForhandsvarselSkjema />
        )
      ) : (
        <NyVurdering handleClick={() => setShowStartetVurdering(true)} />
      )}
    </div>
  );
}
