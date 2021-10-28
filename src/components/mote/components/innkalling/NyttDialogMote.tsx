import React, { ReactElement, useState } from "react";
import { FlexRow } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Link } from "react-router-dom";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { BehandlerParticipateModal } from "@/components/mote/components/innkalling/BehandlerParticipateModal";
import { NyLosningModal } from "@/components/mote/components/innkalling/NyLosningModal";
import { ChooseBehandlerModal } from "@/components/mote/components/innkalling/ChooseBehandlerModal";
import { useBehandlereDialogmeldingQuery } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
  const [behandlerModalIsOpen, setBehandlerModalIsOpen] = useState(false);
  const [chooseBehandlerModalIsOpen, setChooseBehandlerModalIsOpen] = useState(
    false
  );
  const [nyLosningModalIsOpen, setNyLosningModalIsOpen] = useState(false);
  const { brukerKanVarslesDigitalt } = useNavBrukerData();

  const { data: behandlere } = useBehandlereDialogmeldingQuery();

  const {
    isDm2FysiskBrevEnabled,
    isDm2InnkallingFastlegeEnabled,
  } = useDM2FeatureToggles();
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

      <BehandlerParticipateModal
        isOpen={behandlerModalIsOpen}
        setIsOpen={setBehandlerModalIsOpen}
        setNyLosningModalIsOpen={setNyLosningModalIsOpen}
        setChooseBehandlerModalIsOpen={setChooseBehandlerModalIsOpen}
        isDm2InnkallingFastlegeEnabled={isDm2InnkallingFastlegeEnabled}
        behandlere={behandlere || []}
      />

      {isDm2InnkallingFastlegeEnabled && (
        <ChooseBehandlerModal
          isOpen={chooseBehandlerModalIsOpen}
          setIsOpen={setChooseBehandlerModalIsOpen}
          setNyLosningModalIsOpen={setNyLosningModalIsOpen}
          behandlere={behandlere || []}
        />
      )}

      <NyLosningModal
        isOpen={nyLosningModalIsOpen}
        setIsOpen={setNyLosningModalIsOpen}
      />
    </>
  );
};
