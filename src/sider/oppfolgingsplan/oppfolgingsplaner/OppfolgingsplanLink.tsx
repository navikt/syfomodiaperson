import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import { LinkPanel } from "@navikt/ds-react";
import OppfolgingsplanVirksomhetTittel from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanVirksomhetTittel";
import React from "react";
import {
  restdatoTilLesbarDato,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";

const texts = {
  duration: "Varighet",
  shared: "Delt med Nav",
};

function durationText(plan: OppfolgingsplanDTO) {
  return `${texts.duration} ${tilLesbarPeriodeMedArstall(
    plan.godkjentPlan.gyldighetstidspunkt.fom,
    plan.godkjentPlan.gyldighetstidspunkt.tom
  )}`;
}

function deltMedNavText(plan: OppfolgingsplanDTO) {
  const sharedDate =
    plan.godkjentPlan &&
    restdatoTilLesbarDato(plan.godkjentPlan.deltMedNAVTidspunkt);
  return `${texts.shared} ${sharedDate}`;
}

interface Props {
  dialog: OppfolgingsplanDTO;
}

export default function OppfolgingsplanLink({ dialog }: Props) {
  return (
    <LinkPanel href={`/sykefravaer/oppfoelgingsplaner/${dialog.id}`}>
      <LinkPanel.Title>
        <OppfolgingsplanVirksomhetTittel plan={dialog} />
      </LinkPanel.Title>
      <LinkPanel.Description>
        <p>{durationText(dialog)}</p>
        <p>{deltMedNavText(dialog)}</p>
      </LinkPanel.Description>
    </LinkPanel>
  );
}
