import {
  FlexColumn,
  FlexRow,
  ModalContentContainer,
} from "@/components/Layout";
import ModalWrapper from "nav-frontend-modal";
import React from "react";
import styled from "styled-components";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { LenkepanelBase } from "nav-frontend-lenkepanel";
import { Systemtittel } from "nav-frontend-typografi";
import { capitalizeFoersteBokstav } from "@/utils/stringUtils";
import { useTrackOnClick } from "@/data/logging/loggingHooks";
import { behandlerNavn } from "@/utils/behandlerUtils";

const texts = {
  chooseBehandler: "Velg behandler",
  otherBehandler: "En annen behandler",
  otherBehandlerDescription:
    "Møteplanlegger kan brukes, innkalling må sendes fra Arena",
};

const RedHeader = styled(Systemtittel)`
  color: #c30000;
`;

const BehandlerPanelInfo = styled.div`
  .lenkepanel__heading {
    padding-bottom: 0.5em;
  }
`;

interface ChooseBehandlerModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  setNyLosningModalIsOpen: (newState: boolean) => void;
  behandlere: BehandlerDialogmeldingDTO[];
  setBehandler: (behandler: BehandlerDialogmeldingDTO) => void;
}

export const ChooseBehandlerModal = ({
  isOpen,
  setIsOpen,
  setNyLosningModalIsOpen,
  behandlere,
  setBehandler,
}: ChooseBehandlerModalProps) => {
  const trackButtonClick = useTrackOnClick();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      closeButton={true}
      contentLabel={texts.chooseBehandler}
      ariaHideApp={false}
    >
      <ModalContentContainer>
        <FlexRow>
          <h3>{texts.chooseBehandler}</h3>
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            {behandlere.map((behandler, index) => {
              return (
                <LenkepanelBase
                  key={index}
                  border
                  href="#"
                  onClick={() => {
                    setIsOpen(false);
                    setNyLosningModalIsOpen(true);
                    setBehandler(behandler);
                  }}
                >
                  <BehandlerPanelInfo>
                    <Systemtittel className="lenkepanel__heading">{`${behandlerNavn(
                      behandler
                    )}, ${behandler.kontor}`}</Systemtittel>
                    <p>
                      {capitalizeFoersteBokstav(behandler.type.toLowerCase())}
                    </p>
                  </BehandlerPanelInfo>
                </LenkepanelBase>
              );
            })}
            <LenkepanelBase
              href={"/sykefravaer/mote"}
              border
              onClick={() => {
                trackButtonClick(texts.otherBehandler);
              }}
            >
              <BehandlerPanelInfo>
                <RedHeader className="lenkepanel__heading">
                  {texts.otherBehandler}
                </RedHeader>
                <p>{texts.otherBehandlerDescription}</p>
              </BehandlerPanelInfo>
            </LenkepanelBase>
          </FlexColumn>
        </FlexRow>
      </ModalContentContainer>
    </ModalWrapper>
  );
};
