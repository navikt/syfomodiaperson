import React, { ReactElement, useState } from "react";
import { FlexRow } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { NyLosningModal } from "@/components/mote/components/innkalling/NyLosningModal";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
  const [nyLosningModalIsOpen, setNyLosningModalIsOpen] = useState(false);

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
