import React, { ReactNode } from "react";

interface StatusopplysningerProps {
  children?: ReactNode;
}

export function Statusopplysninger({ children }: StatusopplysningerProps) {
  return <div className="statusopplysninger">{children}</div>;
}

interface StatuspanelProps {
  children?: ReactNode;
  enKolonne?: boolean;
}

export default function Statuspanel({
  children,
  enKolonne = false,
}: StatuspanelProps) {
  const kolonneStyle = enKolonne ? "statuspanel--enKol" : "statuspanel--toKol";
  return (
    <div className={`empty:hidden blokk statuspanel ${kolonneStyle}`}>
      {children}
    </div>
  );
}
