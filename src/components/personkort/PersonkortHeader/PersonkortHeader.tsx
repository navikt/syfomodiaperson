import React from "react";
import styled from "styled-components";
import {
  formaterFnr,
  hentBrukersAlderFraFnr,
  hentBrukersKjoennFraFnr,
} from "@/utils/fnrUtils";
import { KJOENN } from "@/konstanter";
import CopyButton from "../../kopierknapp/CopyButton";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { SyketilfelleSummary } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";
import { Tooltip } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";

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
    <div className="personkortHeader">
      <div className="personkortHeader__info">
        <img
          className="mr-4"
          src={
            hentBrukersKjoennFraFnr(personident) === KJOENN.KVINNE
              ? getKvinneImage()
              : getMannImage()
          }
          alt="person"
        />
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
    </div>
  );
};

export default PersonkortHeader;
