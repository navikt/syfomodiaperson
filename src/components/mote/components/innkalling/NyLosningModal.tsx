import {
  FlexColumn,
  FlexRow,
  ModalContentContainer,
} from "@/components/Layout";
import Veileder from "nav-frontend-veileder";
import { ArbeiderKvinneImage } from "../../../../../img/ImageComponents";
import { Link } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { TrackedKnapp } from "@/components/buttons/TrackedKnapp";
import { TrackedFlatknapp } from "@/components/buttons/TrackedFlatknapp";
import ModalWrapper from "nav-frontend-modal";
import React from "react";
import styled from "styled-components";

const texts = {
  nyLosningInnkalling: "Ny løsning for innkalling til Dialogmøte",
  arbeiderBilde: "Bilde av arbeider",
  nei: "Nei",
  ja: "Ja",
  avbryt: "Avbryt",
  modalDM2Info:
    "Vi utvikler en ny løsning der du kan kalle inn til dialogmøte og skrive referat direkte i Modia.",
  modalOnskerDuProveTrackingContext:
    "Møtelandingsside: Modal ønsker du å prøve",
  modalOnskerDuProve: "Ønsker du å prøve ut den nye løsningen?",
};

const ModalText = styled.div`
  max-width: 40ch;
`;

interface NyLosningModalDeltaModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
}

export const NyLosningModal = ({
  isOpen,
  setIsOpen,
}: NyLosningModalDeltaModalProps) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      closeButton={true}
      contentLabel={texts.nyLosningInnkalling}
      ariaHideApp={false}
    >
      <ModalContentContainer>
        <FlexRow>
          <Veileder
            center
            tekst={<ModalText>{texts.modalDM2Info}</ModalText>}
            posisjon="høyre"
          >
            <img alt={texts.arbeiderBilde} src={ArbeiderKvinneImage} />
          </Veileder>
        </FlexRow>

        <FlexRow>
          <h3>{texts.modalOnskerDuProve}</h3>
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            <Link to={dialogmoteRoutePath}>
              <TrackedKnapp
                context={texts.modalOnskerDuProveTrackingContext}
                onClick={() => setIsOpen(false)}
              >
                {texts.ja}
              </TrackedKnapp>
            </Link>
          </FlexColumn>
          <FlexColumn>
            <Link to="/sykefravaer/mote">
              <TrackedKnapp
                context={texts.modalOnskerDuProveTrackingContext}
                onClick={() => setIsOpen(false)}
              >
                {texts.nei}
              </TrackedKnapp>
            </Link>
          </FlexColumn>
          <FlexColumn>
            <TrackedFlatknapp
              context={texts.modalOnskerDuProveTrackingContext}
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
