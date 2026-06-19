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
      className={`${className} flex flex-row -xl:flex-col -xl:overflow-y-auto`}
    >
      {children}
    </div>
  );
}

export function FirstColumn({ children, className }: Props) {
  return (
    <div
      className={`${className} xl:grow-3 xl:shrink xl:basis-0 xl:mr-2 min-w-0 `}
    >
      {children}
    </div>
  );
}

export function SecondColumn({ children, className }: Props) {
  return (
    <div
      className={`${className} xl:grow-2 xl:shrink xl:basis-0 xl:h-screen xl:sticky xl:top-2 xl:overflow-y-auto -xl:mt-2 min-w-0 `}
    >
      {children}
    </div>
  );
}
