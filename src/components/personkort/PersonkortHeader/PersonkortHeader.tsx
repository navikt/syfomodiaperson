import React from "react";
import styled from "styled-components";
import { CopyButton } from "../../kopierknapp/CopyButton";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { HStack } from "@navikt/ds-react";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { NavnHeader } from "@/components/personkort/PersonkortHeader/NavnHeader";
import Utbetalingsinfo from "@/components/personkort/PersonkortHeader/Utbetalingsinfo";
import { formaterFnr } from "@/utils/fnrUtils";
import {
  useCurrentVarighetOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import { KJOENN } from "@/konstanter";

const texts = {
  copied: "Kopiert!",
  varighet: "Varighet: ",
  uker: "uker",
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
  const oppfolgingstilfelleStartDate = useStartOfLatestOppfolgingstilfelle();
  const oppfolgingstilfelleVarighetUker =
    useCurrentVarighetOppfolgingstilfelle();

  const maksdato = getMaksdato.data?.maxDate;

  return (
    <>
      <div className="flex personkortHeader__info">
        {navbruker.kjonn !== KJOENN.UKJENT && (
          <img
            className="mr-4 w-12"
            src={
              navbruker.kjonn === KJOENN.KVINNE
                ? getKvinneImage()
                : getMannImage()
            }
            alt="person"
          />
        )}
        <div>
          <NavnHeader navnSykmeldt={navbruker.navn} alder={navbruker.alder} />

          <StyledFnr>
            {formaterFnr(personident)}
            <CopyButton message={texts.copied} value={personident} />
          </StyledFnr>

          <HStack gap="space-12">
            <TilfellePeriod />
            {oppfolgingstilfelleStartDate && (
              <div className="font-normal">
                <span>{texts.varighet}</span>
                <b>{`${oppfolgingstilfelleVarighetUker} ${texts.uker}`}</b>
              </div>
            )}
            <Diagnosekode />
          </HStack>

          {getMaksdato.isSuccess && <Utbetalingsinfo maksdato={maksdato} />}
        </div>
      </div>
      <PersonkortHeaderTags />
    </>
  );
}
