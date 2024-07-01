import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";

const texts = {
  title: "Oppfølging i sen fase",
};

export const SenOppfolgingSide = (): ReactElement => {
  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.SENOPPFOLGING}>
      <Sidetopp tittel={texts.title} />
      <div>Her kommer det ting!</div>
    </Side>
  );
};
