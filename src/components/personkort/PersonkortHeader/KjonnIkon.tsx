import { KJOENN, Kjoenn } from "@/data/navbruker/types/BrukerinfoDTO";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import React from "react";

export function KjonnIkon({ kjonn }: { kjonn: Kjoenn }) {
  if (kjonn === Kjoenn.UKJENT) {
    return null;
  }
  return (
    <img
      className="mr-4"
      src={kjonn === Kjoenn.KVINNE ? getKvinneImage() : getMannImage()}
      alt="person"
    />
  );
}
