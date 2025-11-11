import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";
import React, { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
}

export function EksternLenke({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLinkIcon title="Ekstern lenke" fontSize="1.5em" />
    </Link>
  );
}
