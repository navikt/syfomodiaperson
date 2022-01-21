import React from "react";
import Side from "../../../sider/Side";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import Motelandingsside from "../components/Motelandingsside";

const texts = {
  pageTitle: "Møtelandingsside",
};

const MotelandingssideContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={MOETEPLANLEGGER}>
      <Motelandingsside />
    </Side>
  );
};

export default MotelandingssideContainer;
