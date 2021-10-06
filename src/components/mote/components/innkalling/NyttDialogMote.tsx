import { ArbeiderKvinneImage } from "../../../../../img/ImageComponents";
import ModalWrapper from "nav-frontend-modal";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import Veileder from "nav-frontend-veileder";
import { FlexColumn, FlexRow, ModalContentContainer } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { TrackedFlatknapp } from "../../../buttons/TrackedFlatknapp";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Link } from "react-router-dom";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { dialogmoteRoutePath } from "@/routers/AppRouter";

const ModalText = styled.div`
  max-width: 40ch;
`;

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
  behandlerVaereMedTrackingContext:
    "Møtelandingsside: Modal behandler være med",
  behandlerVaereMed: "Skal behandleren være med i dialogmøtet?",
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

export const NyttDialogMote = (): ReactElement => {
  const [behandlerModalIsOpen, setBehandlerModalIsOpen] = useState(false);
  const [nyLosningModalIsOpen, setNyLosningModalIsOpen] = useState(false);
  const { brukerKanVarslesDigitalt } = useNavBrukerData();
  const { isDm2FysiskBrevEnabled } = useDM2FeatureToggles();
  const kanBrukeNyLosningInnkalling =
    brukerKanVarslesDigitalt || isDm2FysiskBrevEnabled;

  if (!kanBrukeNyLosningInnkalling) {
    return (
      <FlexRow>
        <Link to="/sykefravaer/mote">
          <TrackedKnapp
            data-cy="nyttDM2Mote"
            context={texts.nyttMoteTrackingContext}
          >
            {texts.nyttMote}
          </TrackedKnapp>
        </Link>
      </FlexRow>
    );
  }

  return (
    <>
      <FlexRow>
        <TrackedKnapp
          data-cy="nyttDM2Mote"
          context={texts.nyttMoteTrackingContext}
          onClick={() => {
            setBehandlerModalIsOpen(true);
          }}
        >
          {texts.nyttMote}
        </TrackedKnapp>
      </FlexRow>

      <ModalWrapper
        isOpen={behandlerModalIsOpen}
        onRequestClose={() => setBehandlerModalIsOpen(false)}
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
                  onClick={() => setBehandlerModalIsOpen(false)}
                >
                  {texts.ja}
                </TrackedKnapp>
              </Link>
            </FlexColumn>
            <FlexColumn>
              <TrackedKnapp
                context={texts.behandlerVaereMedTrackingContext}
                onClick={() => {
                  setBehandlerModalIsOpen(false);
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
                  setBehandlerModalIsOpen(false);
                }}
              >
                {texts.avbryt}
              </TrackedFlatknapp>
            </FlexColumn>
          </FlexRow>
        </ModalContentContainer>
      </ModalWrapper>

      <ModalWrapper
        isOpen={nyLosningModalIsOpen}
        onRequestClose={() => setNyLosningModalIsOpen(false)}
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
                  onClick={() => setNyLosningModalIsOpen(false)}
                >
                  {texts.ja}
                </TrackedKnapp>
              </Link>
            </FlexColumn>
            <FlexColumn>
              <Link to="/sykefravaer/mote">
                <TrackedKnapp
                  context={texts.modalOnskerDuProveTrackingContext}
                  onClick={() => setNyLosningModalIsOpen(false)}
                >
                  {texts.nei}
                </TrackedKnapp>
              </Link>
            </FlexColumn>
            <FlexColumn>
              <TrackedFlatknapp
                context={texts.modalOnskerDuProveTrackingContext}
                onClick={() => {
                  setNyLosningModalIsOpen(false);
                }}
              >
                {texts.avbryt}
              </TrackedFlatknapp>
            </FlexColumn>
          </FlexRow>
        </ModalContentContainer>
      </ModalWrapper>
    </>
  );
};
