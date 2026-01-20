import React, { ReactNode } from "react";

interface Props {
  tittel: string;
  children?: ReactNode;
}

export function SykmeldingNokkelOpplysning({ tittel, children }: Props) {
  return (
    <div className="nokkelopplysning">
      <h3 className="nokkelopplysning__tittel">{tittel}</h3>
      {children}
    </div>
  );
}
