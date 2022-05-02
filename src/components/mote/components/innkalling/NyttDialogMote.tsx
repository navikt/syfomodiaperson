import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { TrackedHovedknapp } from "@/components/buttons/TrackedHovedknapp";

const texts = {
  nyttMote: "Nytt dialogmøte",
  nyttMoteTrackingContext: "Møtelandingsside: Opprett nytt dialogmøte",
};

export const NyttDialogMote = (): ReactElement => {
  return (
    <Link to={dialogmoteRoutePath}>
      <TrackedHovedknapp
        data-cy="nyttDM2Mote"
        context={texts.nyttMoteTrackingContext}
      >
        {texts.nyttMote}
      </TrackedHovedknapp>
    </Link>
  );
};
