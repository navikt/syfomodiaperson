import { KJOENN } from "@/konstanter";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import React from "react";

export function KjonnIkon({ kjonn }: { kjonn: KJOENN }) {
  if (kjonn === KJOENN.UKJENT) {
    return null;
  }
  return (
    <img
      className="mr-4 w-12"
      src={kjonn === KJOENN.KVINNE ? getKvinneImage() : getMannImage()}
      alt="person"
    />
  );
}
