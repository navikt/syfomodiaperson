import { hentBrukersKjoennFraFnr } from "@/utils/fnrUtils";
import { KJOENN } from "@/konstanter";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import React from "react";

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
