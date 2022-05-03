import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { TrackedKnapp } from "../buttons/TrackedKnapp";
import { dialogmoteUnntakRoutePath } from "@/routers/AppRouter";

const texts = {
  settUnntak: "Sett unntak",
  settUnntakTrackingContext: "Møtelandingsside: Sett unntak",
};

export const DialogmoteunntakSkjemaLenke = (): ReactElement => {
  return (
    <Link to={dialogmoteUnntakRoutePath}>
      <TrackedKnapp
        data-cy="settUnntakDialogmote"
        context={texts.settUnntakTrackingContext}
      >
        {texts.settUnntak}
      </TrackedKnapp>
    </Link>
  );
};
