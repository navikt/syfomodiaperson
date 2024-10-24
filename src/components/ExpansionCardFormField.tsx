import React, { ReactNode, useEffect, useState } from "react";
import { ExpansionCard } from "@navikt/ds-react";

interface Props {
  ariaLabel: string;
  heading: ReactNode;
  children: ReactNode;
  hasError?: boolean;
}

export const ExpansionCardFormField = ({
  ariaLabel,
  heading,
  children,
  hasError,
}: Props) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (hasError) {
      setOpen(true);
    }
  }, [hasError]);

  return (
    <ExpansionCard
      aria-label={ariaLabel}
      size="small"
      open={open}
      onToggle={() => setOpen(!open)}
    >
      <ExpansionCard.Header>{heading}</ExpansionCard.Header>
      <ExpansionCard.Content>{children}</ExpansionCard.Content>
    </ExpansionCard>
  );
};
