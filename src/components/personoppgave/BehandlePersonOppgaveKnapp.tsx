import React from "react";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { Button, Detail } from "@navikt/ds-react";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

const getFerdigbehandletPrefixText = (personoppgaveType: PersonOppgaveType) => {
  switch (personoppgaveType) {
    case PersonOppgaveType.BEHANDLERDIALOG_SVAR:
      return "Siste melding lest av";
    default:
      return "Ferdigbehandlet av";
  }
};

const getFerdigbehandletText = (
  personOppgave: PersonOppgave,
  veilederNavn: string | undefined,
) => {
  const ferdigbehandletPrefixText = getFerdigbehandletPrefixText(
    personOppgave.type,
  );

  return `
    ${ferdigbehandletPrefixText} 
    ${veilederNavn} 
    ${toDatePrettyPrint(personOppgave.behandletTidspunkt)}
  `;
};

interface Props {
  personOppgave: PersonOppgave | undefined;
  isBehandlet: boolean;
  handleBehandleOppgave: () => void;
  isBehandleOppgaveLoading: boolean;
  behandleOppgaveText: string;
  buttonText: string;
  hasWriteAccess: boolean;
}

export default function BehandlePersonOppgaveKnapp({
  personOppgave,
  isBehandlet,
  handleBehandleOppgave,
  isBehandleOppgaveLoading,
  behandleOppgaveText,
  buttonText,
  hasWriteAccess,
}: Props) {
  const { data: veilederInfo } = useVeilederInfoQuery(
    personOppgave?.behandletVeilederIdent ?? "",
  );

  return (
    <div className={"flex flex-row items-center gap-2"}>
      {!isBehandlet && hasWriteAccess && (
        <div className={"flex flex-col  gap-2"}>
          <Button
            className={"w-fit"}
            size={"small"}
            variant={"secondary"}
            onClick={handleBehandleOppgave}
            loading={isBehandleOppgaveLoading}
          >
            {buttonText}
          </Button>
          <Detail>{behandleOppgaveText}</Detail>
        </div>
      )}
      {isBehandlet && personOppgave && (
        <Detail>
          {getFerdigbehandletText(personOppgave, veilederInfo?.fulltNavn())}
        </Detail>
      )}
    </div>
  );
}
