import React from "react";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { BodyShort, CopyButton, Heading, HStack } from "@navikt/ds-react";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import Utbetalingsinfo from "@/components/personkort/PersonkortHeader/Utbetalingsinfo";
import { formaterFnr } from "@/utils/fnrUtils";
import {
  useCurrentVarighetOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import { KJOENN } from "@/konstanter";
import { Arbeidsforhold } from "@/components/personkort/PersonkortHeader/Arbeidsforhold.tsx";

const texts = {
  varighet: "Varighet: ",
  uker: "uker",
  fnr: "F.nr: ",
};

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
      <div>
        <div className="flex mb-1">
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
            <div className="flex gap-2">
            <Heading size="xsmall" level="3" className="uppercase">
              {navbruker.navn}
              {navbruker.alder !== null && ` (${navbruker.alder} år)`}
            </Heading>
            <div className="flex items-center gap-2">
              <div>
                <BodyShort size="medium" as="span">
                  {texts.fnr}
                </BodyShort>
                <BodyShort size="medium" weight="semibold" as="span">
                  {formaterFnr(personident)}
                </BodyShort>
              </div>
              <CopyButton copyText={personident} className="p-0" />
            </div>
          </div>
        </div>
        <Arbeidsforhold />
        <HStack gap="space-12">
          <TilfellePeriod />
          {oppfolgingstilfelleStartDate && (
            <div>
              <BodyShort size="small" as="span">
                {texts.varighet}
              </BodyShort>
              <BodyShort
                size="small"
                weight="semibold"
                as="span"
              >{`${oppfolgingstilfelleVarighetUker} ${texts.uker}`}</BodyShort>
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
