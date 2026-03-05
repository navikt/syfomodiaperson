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
          (sporsmal) =>
            sporsmal.svar.length > 0 ||
            sporsmal.undersporsmal.length > 0 ||
            sporsmal.svartype === SvarTypeDTO.IKKE_RELEVANT
        )
        .map((sporsmal) => (
          <div
            key={getKey(sporsmal.tag, sporsmal.id)}
            className="border-b border-solid mb-8 pb-8 last:border-b-0 last:mb-0 last:pb-0"
          >
            <OppsummeringSporsmal {...sporsmal} />
          </div>
        ))}
    </>
  );
}
