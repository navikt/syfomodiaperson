import { KJOENN } from "@/konstanter";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import React from "react";

export function hentBrukersKjoennFraFnr(fnr: string) {
  const kjonnSiffer = Number(fnr.substring(8, 9));
  if (kjonnSiffer % 2 === 0) {
    return KJOENN.KVINNE;
  }
  return KJOENN.MANN;
}

export function KjonnIkon({ personident }: { personident: string }) {
  return (
    <img
      className="mr-4"
      src={
        hentBrukersKjoennFraFnr(personident) === KJOENN.KVINNE
          ? getKvinneImage()
          : getMannImage()
      }
      alt="person"
    />
  );
}
