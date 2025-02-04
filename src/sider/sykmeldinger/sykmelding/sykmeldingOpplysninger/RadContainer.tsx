import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RadContainer({ children }: Props) {
  return (
    <div
      className={
        "md:flex md:mr-8 md:flex-1 md:w-[calc(50% - 2rem)] md:last:*:w-1/2 md:last:*:mr-0"
      }
    >
      {children}
    </div>
  );
}
