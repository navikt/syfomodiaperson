import React from "react";
import { FlexRow } from "../../../Layout";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { useNavigate } from "react-router-dom";

const texts = {
  moteStatusTrackingContext: "Møtelandingsside: Se møtestatus",
  gaTilMotestatus: "Gå til møtestatus",
};

export const SeMoteStatus = () => {
  const navigate = useNavigate();

  return (
    <FlexRow>
      <TrackedKnapp
        context={texts.moteStatusTrackingContext}
        onClick={() => navigate("/sykefravaer/mote")}
      >
        {texts.gaTilMotestatus}
      </TrackedKnapp>
    </FlexRow>
  );
};
