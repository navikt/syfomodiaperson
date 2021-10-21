import React from "react";
import {
  FlexColumn,
  FlexRow,
  ModalContentContainer,
} from "@/components/Layout";
import { Link } from "react-router-dom";
import { TrackedKnapp } from "@/components/buttons/TrackedKnapp";
import { TrackedFlatknapp } from "@/components/buttons/TrackedFlatknapp";
import ModalWrapper from "nav-frontend-modal";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

const texts = {
  behandlerVaereMedTrackingContext:
    "Møtelandingsside: Modal behandler være med",
  behandlerVaereMed: "Skal behandleren være med i dialogmøtet?",
  nei: "Nei",
  ja: "Ja",
  avbryt: "Avbryt",
};

interface BehandlerYesButtonProps {
  setIsOpen: (newState: boolean) => void;
  setChooseBehandlerModalIsOpen: (newState: boolean) => void;
  isDm2InnkallingFastlegeEnabled: boolean;
  behandlere: BehandlerDialogmeldingDTO[];
}

const BehandlerYesButton = ({
  setIsOpen,
  setChooseBehandlerModalIsOpen,
  isDm2InnkallingFastlegeEnabled,
  behandlere,
}: BehandlerYesButtonProps) => {
  return isDm2InnkallingFastlegeEnabled && behandlere.length > 0 ? (
    <TrackedKnapp
      context={texts.behandlerVaereMedTrackingContext}
      onClick={() => {
        setIsOpen(false);
        setChooseBehandlerModalIsOpen(true);
      }}
    >
      {texts.ja}
    </TrackedKnapp>
  ) : (
    <Link to="/sykefravaer/mote">
      <TrackedKnapp
        context={texts.behandlerVaereMedTrackingContext}
        onClick={() => setIsOpen(false)}
      >
        {texts.ja}
      </TrackedKnapp>
    </Link>
  );
};

interface SkalBehandlerDeltaModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  setNyLosningModalIsOpen: (newState: boolean) => void;
  setChooseBehandlerModalIsOpen: (newState: boolean) => void;
  isDm2InnkallingFastlegeEnabled: boolean;
  behandlere: BehandlerDialogmeldingDTO[];
}

export const BehandlerParticipateModal = ({
  isOpen,
  setIsOpen,
  setNyLosningModalIsOpen,
  setChooseBehandlerModalIsOpen,
  isDm2InnkallingFastlegeEnabled,
  behandlere,
}: SkalBehandlerDeltaModalProps) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      closeButton={true}
      contentLabel={texts.behandlerVaereMed}
      ariaHideApp={false}
    >
      <ModalContentContainer>
        <FlexRow>
          <h3>{texts.behandlerVaereMed}</h3>
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            <BehandlerYesButton
              setIsOpen={setIsOpen}
              setChooseBehandlerModalIsOpen={setChooseBehandlerModalIsOpen}
              isDm2InnkallingFastlegeEnabled={isDm2InnkallingFastlegeEnabled}
              behandlere={behandlere}
            />
          </FlexColumn>
          <FlexColumn>
            <TrackedKnapp
              context={texts.behandlerVaereMedTrackingContext}
              onClick={() => {
                setIsOpen(false);
                setNyLosningModalIsOpen(true);
              }}
            >
              {texts.nei}
            </TrackedKnapp>
          </FlexColumn>
          <FlexColumn>
            <TrackedFlatknapp
              context={texts.behandlerVaereMedTrackingContext}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {texts.avbryt}
            </TrackedFlatknapp>
          </FlexColumn>
        </FlexRow>
      </ModalContentContainer>
    </ModalWrapper>
  );
};
