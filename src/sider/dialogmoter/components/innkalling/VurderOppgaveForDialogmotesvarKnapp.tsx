import React from "react";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";

const texts = {
  fjernOppgave:
    "Markerer alle møtesvar som vurdert og fjerner oppgavene fra oversikten.",
  markerVurdertOppgaveButtonText: "Marker som vurdert",
};

interface VurderTilbakemeldingPaInnkallingKnappProps {
  personOppgave: PersonOppgave;
}

const VurderOppgaveForDialogmotesvarKnapp = ({
  personOppgave,
}: VurderTilbakemeldingPaInnkallingKnappProps) => {
  const isBehandlet = isBehandletOppgave(personOppgave);
  const behandlePersonOppgave = useBehandlePersonoppgave();

  return (
    <BehandlePersonOppgaveKnapp
      personOppgave={personOppgave}
      isBehandlet={isBehandlet}
      handleBehandleOppgave={() =>
        behandlePersonOppgave.mutate(personOppgave.uuid)
      }
      isBehandleOppgaveLoading={behandlePersonOppgave.isPending}
      behandleOppgaveText={texts.fjernOppgave}
      buttonText={texts.markerVurdertOppgaveButtonText}
    />
  );
};

export default VurderOppgaveForDialogmotesvarKnapp;
