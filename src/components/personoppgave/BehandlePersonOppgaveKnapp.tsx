import React from "react";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { Checkbox, Panel } from "@navikt/ds-react";
import styled from "styled-components";
import navFarger from "nav-frontend-core";

const getBehandlePersonOppgaveKnappLabel = (
  isBehandlet: boolean,
  personOppgave: PersonOppgave,
  behandlePersonOppgaveText: string
): string => {
  return isBehandlet
    ? `Ferdigbehandlet av ${
        personOppgave.behandletVeilederIdent
      } ${toDatePrettyPrint(personOppgave.behandletTidspunkt)}`
    : behandlePersonOppgaveText;
};

const CheckboxPanel = styled(Panel)`
  border: 1px solid ${navFarger.navGra20};
`;

interface BehandlePersonoppgaveKnappProps {
  personOppgave: PersonOppgave;
  isBehandlet: boolean;
  behandlePersonOppgaveMutation: () => void;
  behandlePersonOppgaveMutationIsLoading: boolean;
  behandlePersonOppgaveText: string;
}

const BehandlePersonOppgaveKnapp = ({
  personOppgave,
  isBehandlet,
  behandlePersonOppgaveMutation,
  behandlePersonOppgaveMutationIsLoading,
  behandlePersonOppgaveText,
}: BehandlePersonoppgaveKnappProps) => {
  return (
    <CheckboxPanel>
      <Checkbox
        onClick={behandlePersonOppgaveMutation}
        disabled={isBehandlet || behandlePersonOppgaveMutationIsLoading}
        defaultChecked={isBehandlet}
        size="small"
      >
        {getBehandlePersonOppgaveKnappLabel(
          isBehandlet,
          personOppgave,
          behandlePersonOppgaveText
        )}
      </Checkbox>
    </CheckboxPanel>
  );
};

export default BehandlePersonOppgaveKnapp;
