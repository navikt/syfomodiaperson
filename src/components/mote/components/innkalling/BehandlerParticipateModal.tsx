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

const texts = {
  behandlerVaereMedTrackingContext:
    "Møtelandingsside: Modal behandler være med",
  behandlerVaereMed: "Skal behandleren være med i dialogmøtet?",
  nei: "Nei",
  ja: "Ja",
  avbryt: "Avbryt",
};

interface SkalBehandlerDeltaModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  setNyLosningModalIsOpen: (newState: boolean) => void;
}

export const BehandlerParticipateModal = ({
  isOpen,
  setIsOpen,
  setNyLosningModalIsOpen,
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
            <Link to="/sykefravaer/mote">
              <TrackedKnapp
                context={texts.behandlerVaereMedTrackingContext}
                onClick={() => setIsOpen(false)}
              >
                {texts.ja}
              </TrackedKnapp>
            </Link>
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
