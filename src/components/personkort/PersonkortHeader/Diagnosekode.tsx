import React from "react";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { BodyShort, Tooltip } from "@navikt/ds-react";
import { MedisinskrinImage } from "../../../../img/ImageComponents.ts";
import { sykmeldingerSortertNyestTilEldstPeriode } from "@/data/sykmelding/types/SykmeldingOldFormat";

const texts = {
  tooltip: "Siste kjente diagnosekode",
};

export function Diagnosekode() {
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const sortedSykmeldinger =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger);
  const latestSykmelding = sortedSykmeldinger[0];
  const diagnosekode = latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode;

  return (
    !!diagnosekode && (
      <Tooltip content={texts.tooltip}>
        <div className="flex  items-center">
          <img src={MedisinskrinImage} alt="Medisinskrin" />
          <BodyShort size="small" weight="semibold" className="ml-2">
            {diagnosekode}
          </BodyShort>
        </div>
      </Tooltip>
    )
  );
}
