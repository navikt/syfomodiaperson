import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function SkjemaFieldContainer({ children }: Props) {
  return (
    <div className="[&>*]:pb-[1em] [&>*:last-child]:pb-[2em]">{children}</div>
  );
}
