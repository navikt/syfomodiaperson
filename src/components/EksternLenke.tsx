import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";
import React, { ReactNode } from "react";

interface Props {
  href: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function EksternLenke({ href, children, onClick, className }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLinkIcon title="Ekstern lenke" fontSize="1.5em" />
    </Link>
  );
}
