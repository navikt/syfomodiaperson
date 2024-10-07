import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";
import React, { ReactNode } from "react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
}

export function EksternLenke({ href, children, className }: Props) {
  function countLinkClick() {
    Amplitude.logEvent({
      type: EventType.LinkClick,
      data: {
        sideUrl: window.location.href,
        destinasjonUrl: href,
      },
    });
  }

  return (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={countLinkClick}
    >
      {children}
      <ExternalLinkIcon title="Ekstern lenke" fontSize="1.5em" />
    </Link>
  );
}
