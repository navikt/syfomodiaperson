import { ArbeidsuforhetSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";
import React, { ReactElement } from "react";
import { ArbeidsuforhetForhandsvarsel } from "@/sider/arbeidsuforhet/forhandsvarsel/ArbeidsuforhetForhandsvarsel";

export const ArbeidsuforhetForhandsvarselSide = (): ReactElement => (
  <ArbeidsuforhetSide>
    <ArbeidsuforhetForhandsvarsel />
  </ArbeidsuforhetSide>
);
