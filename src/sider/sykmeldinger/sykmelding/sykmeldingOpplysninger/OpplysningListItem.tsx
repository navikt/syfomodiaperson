import React, { ReactNode } from "react";

interface OpplysningListItemProps {
  children?: ReactNode;
}

export function OpplysningListItem(
  opplysningListItemProps: OpplysningListItemProps
) {
  const { children } = opplysningListItemProps;

  return (
    <p className={`before:content-['–'] before:mr-1 before:inline-block`}>
      {children}
    </p>
  );
}
