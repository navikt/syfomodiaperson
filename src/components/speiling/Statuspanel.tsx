import React, { ReactNode } from "react";

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
