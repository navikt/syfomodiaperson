import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 *
 * Example usage:
 * import * as Tredelt from …
 *
 * <Tredelt.Container>
 *   <Tredelt.FirstColumn>
 *     <Content />
 *   </Tredelt.FirstColumn>
 *   <Tredelt.SecondColumn>
 *     <Content />
 *   </Tredelt.SecondColumn>
 * </Tredelt.Container>
 */
export function Container({ children, className = "" }: Props) {
  return (
    <div
      className={`${className} flex flex-row -xl:flex-col -xl:overflow-y-scroll`}
    >
      {children}
    </div>
  );
}

export function FirstColumn({ children, className }: Props) {
  return (
    <div
      className={
        "xl:flex-grow-[3] xl:flex-shrink-1 xl:basis-0 xl:mr-2 " + className
      }
    >
      {children}
    </div>
  );
}

export function SecondColumn({ children, className }: Props) {
  return (
    <div
      className={
        "xl:flex-grow-[2] xl:flex-shrink-1 xl:basis-0 xl:h-screen xl:sticky xl:top-2 xl:overflow-y-scroll -xl:mt-2 " +
        className
      }
    >
      {children}
    </div>
  );
}
