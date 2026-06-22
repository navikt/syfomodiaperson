import React from "react";
import { CopyButton } from "@/components/kopierknapp/CopyButton";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { BodyShort, HStack } from "@navikt/ds-react";
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
  copied: "Kopiert!",
  varighet: "Varighet: ",
  uker: "uker",
  fnr: "F.nr: ",
  kopiertFnr: "Kopiert fødselsnummer",
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
              className="mr-2 w-12"
              src={
                navbruker.kjonn === KJOENN.KVINNE
                  ? getKvinneImage()
                  : getMannImage()
              }
              alt="person"
            />
          )}
          <div>
            <div className="flex gap-3 items-baseline">
              <BodyShort size="small" weight="semibold" className="uppercase">
                {navbruker.navn}
                {navbruker.alder !== null && ` (${navbruker.alder} år)`}
              </BodyShort>
              <div>
                <BodyShort size="small" as="span">
                  {texts.fnr}
                </BodyShort>
                <BodyShort size="small" weight="semibold" as="span">
                  {formaterFnr(personident)}
                </BodyShort>
                <CopyButton
                  message={texts.copied}
                  value={personident}
                  iconTitle={texts.kopiertFnr}
                />
              </div>
            </div>
            <Arbeidsforhold />
          </div>
        </div>
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
      <PersonkortHeaderTags />
    </>
  );
}
