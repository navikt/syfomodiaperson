import { KJOENN } from "@/konstanter";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import React from "react";

export function KjonnIkon({ kjonn }: { kjonn: string | null }) {
  return (
    <img
      className="mr-4"
      src={kjonn === KJOENN.KVINNE ? getKvinneImage() : getMannImage()}
      alt="person"
    />
  );
}
