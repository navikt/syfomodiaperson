import React from "react";
import { FlexRow } from "../../../Layout";
import { useNavigate } from "react-router-dom";
import Knapp from "nav-frontend-knapper";

const texts = {
  moteStatusTrackingContext: "Møtelandingsside: Se møtestatus",
  gaTilMotestatus: "Gå til møtestatus",
};

export const SeMoteStatus = () => {
  const navigate = useNavigate();

  return (
    <FlexRow>
      <Knapp onClick={() => navigate("/sykefravaer/mote")}>
        {texts.gaTilMotestatus}
      </Knapp>
    </FlexRow>
  );
};
