import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function OpplysningListItem({ children }: Props) {
  return (
    <p className={`before:content-['–'] before:mr-1 before:inline-block`}>
      {children}
    </p>
  );
}
