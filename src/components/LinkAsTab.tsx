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
        "navds-tabs__tab text-text-default no-underline text-center focus-visible:bg-transparent active:bg-transparent active:text-text-default active:shadow-[inset_0_-3px_0_0] active:shadow-border-subtle-hover"
      }
      href={href}
    >
      <span className={"navds-tabs__tab-inner"}>
        <span aria-hidden={!!label}>{icon}</span>
        {label}
      </span>
    </Link>
  );
}
