import React, { ReactElement, useState } from "react";
import { FlexRow } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Link } from "react-router-dom";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { NyLosningModal } from "@/components/mote/components/innkalling/NyLosningModal";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
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
            setNyLosningModalIsOpen(true);
          }}
        >
          {texts.nyttMote}
        </TrackedKnapp>
      </FlexRow>

      <NyLosningModal
        isOpen={nyLosningModalIsOpen}
        setIsOpen={setNyLosningModalIsOpen}
      />
    </>
  );
};
