import React from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import {
  SvarTypeDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export const getKey = (tag: string, id?: string | number): string =>
  `${tag}_${id}`;

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function Oppsummeringsvisning({ soknad: { sporsmal } }: Props) {
  return (
    <>
      {sporsmal
        .filter(
          // Det som skal med
          (sporsmal) =>
            sporsmal.svar.length > 0 ||
            sporsmal.undersporsmal.length > 0 ||
            sporsmal.svartype === SvarTypeDTO.IKKE_RELEVANT,
        )
        .filter(
          // Det som ikke skal med
          (sporsmal) =>
            !(
              sporsmal.svartype === "OPPSUMMERING" &&
              sporsmal.tag === "TIL_SLUTT" &&
              sporsmal.undersporsmal.length === 0
            ),
        )
        .map((sporsmal) => (
          <div
            key={getKey(sporsmal.tag, sporsmal.id)}
            className="border-b border-solid mb-5 pb-3 border-ax-neutral-400 last:border-b-0 last:mb-0 last:pb-0"
          >
            <OppsummeringSporsmal {...sporsmal} />
          </div>
        ))}
    </>
  );
}
