import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { FlexRow } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { dialogmoteRoutePath } from "@/routers/AppRouter";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
  return (
    <>
      <FlexRow>
        <Link to={dialogmoteRoutePath}>
          <TrackedKnapp
            data-cy="nyttDM2Mote"
            context={texts.nyttMoteTrackingContext}
          >
            {texts.nyttMote}
          </TrackedKnapp>
        </Link>
      </FlexRow>
    </>
  );
};
