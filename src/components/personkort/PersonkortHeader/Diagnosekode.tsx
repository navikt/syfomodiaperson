import React from "react";
import styled from "styled-components";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { Tooltip } from "@navikt/ds-react";
import { MedisinskrinImage } from "../../../../img/ImageComponents";
import { sykmeldingerSortertNyestTilEldstPeriode } from "@/data/sykmelding/types/SykmeldingOldFormat";

const texts = {
  tooltip: "Siste kjente diagnosekode",
};

const DiagnosekodeWrapper = styled.div`
  align-self: end;
`;

export function Diagnosekode() {
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const sortedSykmeldinger =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger);
  const latestSykmelding = sortedSykmeldinger[0];
  const diagnosekode = latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode;

  return (
    !!diagnosekode && (
      <DiagnosekodeWrapper>
        <Tooltip content={texts.tooltip}>
          <div>
            <img src={MedisinskrinImage} alt="Medisinskrin" />
            <span className="ml-2">{diagnosekode}</span>
          </div>
        </Tooltip>
      </DiagnosekodeWrapper>
    )
  );
}
