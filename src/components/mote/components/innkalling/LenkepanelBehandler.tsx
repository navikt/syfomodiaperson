import React, { ReactNode } from "react";
import { LenkepanelBase } from "nav-frontend-lenkepanel";

interface LenkepanelBehandlerProps {
  children: ReactNode;
}

export const LenkepanelBehandler = ({ children }: LenkepanelBehandlerProps) => {
  return (
    <LenkepanelBase href={"/sykefravaer/mote"} border>
      {children}
    </LenkepanelBase>
  );
};
