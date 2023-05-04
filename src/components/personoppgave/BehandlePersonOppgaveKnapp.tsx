import React from "react";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { Checkbox } from "@navikt/ds-react";

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
  // TODO: Skrive oss bort fra less-styling
  return (
    <div className="panel checkboxKnappWrapper">
      <div className="skjema__input">
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
      </div>
    </div>
  );
};

export default BehandlePersonOppgaveKnapp;
