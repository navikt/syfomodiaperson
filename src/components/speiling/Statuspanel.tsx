import React, { ReactNode } from "react";
import SykmeldingNokkelOpplysning from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";

interface StatusNokkelopplysningProps {
  children?: ReactNode;
  Overskrift?: keyof JSX.IntrinsicElements;
  tittel: string;
}

export const StatusNokkelopplysning = (
  statusNokkelopplysningProps: StatusNokkelopplysningProps
) => {
  const { children, Overskrift = "h2", tittel } = statusNokkelopplysningProps;
  return (
    <SykmeldingNokkelOpplysning
      className="nokkelopplysning--statusopplysning"
      Overskrift={Overskrift}
      tittel={tittel}
    >
      {children}
    </SykmeldingNokkelOpplysning>
  );
};

interface StatusopplysningerProps {
  children?: ReactNode;
}

export const Statusopplysninger = (
  statusopplysningerProps: StatusopplysningerProps
) => {
  const { children } = statusopplysningerProps;
  return <div className="statusopplysninger">{children}</div>;
};

interface StatuspanelProps {
  children?: ReactNode;
  enKolonne?: boolean;
}

const Statuspanel = (statuspanelProps: StatuspanelProps) => {
  const { children, enKolonne = false } = statuspanelProps;
  const kolonneStyle = enKolonne ? "statuspanel--enKol" : "statuspanel--toKol";
  return (
    <div className={`empty:hidden blokk statuspanel ${kolonneStyle}`}>
      {children}
    </div>
  );
};

export default Statuspanel;
