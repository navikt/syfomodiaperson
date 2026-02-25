import React, { ReactNode } from "react";
import { Link } from "@navikt/ds-react";

interface Props {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
}
export default function LinkAsTab({ href, label, icon }: Props) {
  return (
    <Link
      className={
        "aksel-tabs__tab text-ax-text-neutral no-underline text-center focus-visible:bg-transparent active:bg-transparent active:text-ax-text-neutral active:shadow-[inset_0_-3px_0_0] active:shadow-ax-border-neutral"
      }
      href={href}
    >
      <span className={"aksel-tabs__tab-inner"}>
        <span aria-hidden={!!label}>{icon}</span>
        {label}
      </span>
    </Link>
  );
}
