import React, { ReactNode } from "react";

interface RadContainerProps {
  children?: ReactNode;
}

export function RadContainer(radContainerProps: RadContainerProps) {
  const { children } = radContainerProps;
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
