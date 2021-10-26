import React, { ReactNode } from "react";
import Alertstripe from "nav-frontend-alertstriper";

interface PersonkortFeilmeldingProps {
  children: ReactNode;
}

const PersonkortFeilmelding = ({ children }: PersonkortFeilmeldingProps) => {
  return <Alertstripe type="info">{children}</Alertstripe>;
};

export default PersonkortFeilmelding;
