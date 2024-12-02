import React from "react";
import styled from "styled-components";
import { formaterFnr } from "@/utils/fnrUtils";
import CopyButton from "../../kopierknapp/CopyButton";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { HStack, Tag } from "@navikt/ds-react";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { KjonnIkon } from "@/components/personkort/PersonkortHeader/KjonnIkon";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { NavnHeader } from "@/components/personkort/PersonkortHeader/NavnHeader";
import { MaksdatoSummary } from "@/components/personkort/PersonkortHeader/MaksdatoSummary";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import UtdatertUtbetalingsinfoAlert from "@/components/personkort/PersonkortHeader/UtdatertUtbetalingsinfoAlert";
import { isDateBefore } from "@/utils/datoUtils";

const texts = {
  ikkeUtbetalt: "Sykepenger ikke utbetalt",
  copied: "Kopiert!",
};

const StyledFnr = styled.div`
  display: flex;

  img {
    padding-left: 0.5em;
    width: auto;
    height: 1.2em;
  }
`;

export function PersonkortHeader() {
  const navbruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const { data: maksDato, isSuccess } = useMaksdatoQuery();
  const isUtbetalingsinfoFromBeforeOppfolgingstilfelleStart = isDateBefore(
    maksDato?.maxDate?.opprettet,
    startDate
  );

  return (
    <>
      <div className="flex personkortHeader__info">
        <KjonnIkon personident={personident} />
        <div>
          <NavnHeader navnSykmeldt={navbruker.navn} personident={personident} />

          <StyledFnr>
            {formaterFnr(personident)}
            <CopyButton message={texts.copied} value={personident} />
          </StyledFnr>

          <HStack gap="3">
            <TilfellePeriod />
            <Varighet />
            <Diagnosekode />
          </HStack>

          {isSuccess ? (
            maksDato?.maxDate ? (
              <>
                <MaksdatoSummary maxDate={maksDato.maxDate} />
                {isUtbetalingsinfoFromBeforeOppfolgingstilfelleStart && (
                  <UtdatertUtbetalingsinfoAlert />
                )}
              </>
            ) : (
              <Tag variant="warning" size="small" className="mt-1">
                {texts.ikkeUtbetalt}
              </Tag>
            )
          ) : null}
        </div>
      </div>
      <PersonkortHeaderTags />
    </>
  );
}
