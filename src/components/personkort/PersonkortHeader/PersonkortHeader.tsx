import React from "react";
import styled from "styled-components";
import { formaterFnr } from "@/utils/fnrUtils";
import CopyButton from "../../kopierknapp/CopyButton";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { HStack } from "@navikt/ds-react";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { KjonnIkon } from "@/components/personkort/PersonkortHeader/KjonnIkon";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { NavnHeader } from "@/components/personkort/PersonkortHeader/NavnHeader";
import Utbetalingsinfo from "@/components/personkort/PersonkortHeader/Utbetalingsinfo";

const texts = {
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
  const getMaksdato = useMaksdatoQuery();
  const maksdato = getMaksdato.data?.maxDate;

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

          {getMaksdato.isSuccess && <Utbetalingsinfo maksdato={maksdato} />}
        </div>
      </div>
      <PersonkortHeaderTags />
    </>
  );
}
