import React from "react";
import { ReactElement } from "react";
import { SYKEPENGESOKNADER } from "@/enums/menypunkter";
import Side from "../../../../sider/Side";
import SykepengesoknadContainer from "./SykepengesoknadContainer";

const texts = {
  tittel: "Sykepengesøknader",
};

export const SykepengesoknadSide = (): ReactElement => {
  return (
    <Side tittel={texts.tittel} aktivtMenypunkt={SYKEPENGESOKNADER}>
      <SykepengesoknadContainer />
    </Side>
  );
};
