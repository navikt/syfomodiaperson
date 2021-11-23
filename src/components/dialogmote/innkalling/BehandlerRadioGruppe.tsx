import React, { ReactElement } from "react";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import styled from "styled-components";
import {
  BehandlerDialogmeldingDTO,
  behandlerOneliner,
} from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

const texts = {
  behandlerLegend: "Behandler som inviteres til dialogmøtet",
  behandlerInfo:
    "Fastlegen vil få en dialogmelding med invitasjon. Dersom du ønsker å invitere en annen behandler, må du fortsatt sende innkallingen fra Arena.",
  noBehandler: "Ingen behandler",
};

export const StyledRadioGruppe = styled(RadioGruppe)`
  margin-bottom: 1em;
`;

interface BehandlerRadioGruppeProps {
  behandlere: BehandlerDialogmeldingDTO[];
  setSelectedBehandler: (behandler?: BehandlerDialogmeldingDTO) => void;
}

const BehandlerRadioGruppe = ({
  behandlere,
  setSelectedBehandler,
}: BehandlerRadioGruppeProps): ReactElement => {
  return (
    <>
      <StyledRadioGruppe id={"behandlerId"} legend={texts.behandlerLegend}>
        <Radio
          label={texts.noBehandler}
          name="behandler"
          onChange={() => setSelectedBehandler(undefined)}
        />
        {behandlere.map((behandler, index) => (
          <Radio
            label={behandlerOneliner(behandler)}
            name="behandler"
            key={index}
            onChange={() => setSelectedBehandler(behandler)}
          />
        ))}
      </StyledRadioGruppe>
      <p>{texts.behandlerInfo}</p>
    </>
  );
};

export default BehandlerRadioGruppe;
