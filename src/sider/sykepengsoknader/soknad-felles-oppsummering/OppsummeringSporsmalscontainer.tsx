import React, { ReactElement, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function OppsummeringSporsmalscontainer({
  children,
}: Props): ReactElement {
  return <div className="mb-2">{children}</div>;
}
