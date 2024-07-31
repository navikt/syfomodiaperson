import React from "react";
import styled from "styled-components";
import { formaterFnr, hentBrukersAlderFraFnr } from "@/utils/fnrUtils";
import CopyButton from "../../kopierknapp/CopyButton";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { SyketilfelleSummary } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";
import { Tooltip } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import { KjonnIkon } from "@/components/personkort/PersonkortHeader/KjonnIkon";

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

const PersonkortHeader = () => {
  const navbruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();

  return (
    <>
      <div className="flex personkortHeader__info">
        <KjonnIkon personident={personident} />
        <div>
          <h3 className="flex items-center">
            {`${navbruker.navn} (${hentBrukersAlderFraFnr(personident)} år)`}
            {hasGjentakendeSykefravar && (
              <Tooltip content={"Gjentatt sykefravær"}>
                <ArrowsCirclepathIcon className="ml-2" />
              </Tooltip>
            )}
          </h3>

          <StyledFnr>
            {formaterFnr(personident)}
            <CopyButton message={texts.copied} value={personident} />
          </StyledFnr>
          <SyketilfelleSummary />
        </div>
      </div>
      <PersonkortHeaderTags />
    </>
  );
};

export default PersonkortHeader;
