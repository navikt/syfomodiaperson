import React from "react";
import UtdragOppfolgingsplaner from "./UtdragOppfolgingsplaner";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import Sykmeldinger from "./Sykmeldinger";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";

const texts = {
  header: "Utdrag fra sykefraværet",
};

function tilfelleText(start: Date, end: Date, varighet: number) {
  return `Gjelder sykefraværet: ${tilLesbarPeriodeMedArstall(
    start,
    end
  )} (${varighet} uker).`;
}

interface Props {
  selectedOppfolgingstilfelle?: OppfolgingstilfelleDTO;
}

export default function UtdragFraSykefravaeret({
  selectedOppfolgingstilfelle,
}: Props) {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelle =
    selectedOppfolgingstilfelle || latestOppfolgingstilfelle;

  return (
    <Box
      padding="4"
      background="surface-default"
      className="mb-2 h-min flex flex-col gap-6"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        {oppfolgingstilfelle && (
          <BodyShort size="small">
            {tilfelleText(
              oppfolgingstilfelle?.start,
              oppfolgingstilfelle?.end,
              oppfolgingstilfelle?.varighetUker
            )}
          </BodyShort>
        )}
      </div>
      <UtdragOppfolgingsplaner
        selectedOppfolgingstilfelle={oppfolgingstilfelle}
      />
      <Sykmeldinger selectedOppfolgingstilfelle={oppfolgingstilfelle} />
    </Box>
  );
}
