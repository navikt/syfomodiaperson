import React, { ReactElement, useState } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { NyVurdering } from "@/sider/arbeidsuforhet/NyVurdering";
import { StartetVurdering } from "@/sider/arbeidsuforhet/StartetVurdering";

export const Arbeidsuforhet = (): ReactElement => {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] =
    useState<boolean>(false);

  return (
    <div className="mb-2">
      {showStartetVurdering || isForhandsvarsel ? (
        <StartetVurdering />
      ) : (
        <NyVurdering handleClick={() => setShowStartetVurdering(true)} />
      )}
    </div>
  );
};
