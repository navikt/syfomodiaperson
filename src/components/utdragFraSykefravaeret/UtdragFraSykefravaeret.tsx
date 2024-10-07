import React from "react";
import { finnMiljoStreng } from "@/utils/miljoUtil";
import { UtdragOppfolgingsplaner } from "./UtdragOppfolgingsplaner";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BodyShort, Box, Heading, Link } from "@navikt/ds-react";
import Sykmeldinger from "./Sykmeldinger";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";

const texts = {
  header: "Utdrag fra sykefraværet",
  samtalereferat: {
    header: "Samtalereferat",
    lenkeTekst: "Samtalereferat",
  },
};

function tilfelleText(start: Date, end: Date, varighet: number) {
  return `Gjelder sykefraværet: ${tilLesbarPeriodeMedArstall(
    start,
    end
  )} (${varighet} uker).`;
}

export const Samtalereferat = () => {
  const fnr = useValgtPersonident();
  return (
    <div>
      <Heading size="small" level="3">
        {texts.samtalereferat.header}
      </Heading>
      <Link
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {texts.samtalereferat.lenkeTekst}
      </Link>
    </div>
  );
};

interface Props {
  selectedOppfolgingstilfelle?: OppfolgingstilfelleDTO;
}

const UtdragFraSykefravaeret = ({ selectedOppfolgingstilfelle }: Props) => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelle =
    selectedOppfolgingstilfelle || latestOppfolgingstilfelle;

  return (
    <Box
      padding="4"
      background="surface-default"
      className="mb-4 h-min flex flex-col gap-6"
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
      <Samtalereferat />
      <SpinnsynLenke />
    </Box>
  );
};

export default UtdragFraSykefravaeret;
