import { ReactElement } from "react";

interface Props {
  tittel: string;
  icon: ReactElement;
  children: ReactElement;
}

export function PersonkortElement({ children, icon, tittel }: Props) {
  return (
    <div className="mb-8 w-full last:mb-0">
      <div className="mb-4 flex items-center border-b border-ax-neutral-400 pb-2">
        {icon}
        <h4>{tittel}</h4>
      </div>
      <div>{children}</div>
    </div>
  );
}
