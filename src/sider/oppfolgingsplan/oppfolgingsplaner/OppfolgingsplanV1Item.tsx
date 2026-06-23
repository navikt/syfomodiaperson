import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import { BodyShort, Box, Heading, Link } from "@navikt/ds-react";
import React from "react";
import {
  restdatoTilLesbarDato,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks.ts";

const texts = {
  duration: "Varighet",
  shared: "Delt med Nav",
  apneOppfolgingsplan: "Åpne oppfølgingsplanen (pdf)",
};

function durationText(plan: OppfolgingsplanDTO) {
  return `${texts.duration}: ${tilLesbarPeriodeMedArstall(
    plan.godkjentPlan.gyldighetstidspunkt.fom,
    plan.godkjentPlan.gyldighetstidspunkt.tom,
  )}`;
}

function deltMedNavText(plan: OppfolgingsplanDTO) {
  const sharedDate =
    plan.godkjentPlan &&
    restdatoTilLesbarDato(plan.godkjentPlan.deltMedNAVTidspunkt);
  return `${texts.shared}: ${sharedDate}`;
}

interface Props {
  oppfolgingsplan: OppfolgingsplanDTO;
}

export default function OppfolgingsplanV1Item({ oppfolgingsplan }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(
    oppfolgingsplan.virksomhet.virksomhetsnummer,
  );
  return (
    <Box background="default" padding="space-16" className="mb-2">
      <Heading size="small">{virksomhetsnavn}</Heading>
      <BodyShort size="small">{durationText(oppfolgingsplan)}</BodyShort>
      <BodyShort size="small">{deltMedNavText(oppfolgingsplan)}</BodyShort>
      <Link
        href={`${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplan.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {texts.apneOppfolgingsplan}
      </Link>
    </Box>
  );
}
