import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@navikt/ds-react";
import { ArrowLeftIcon } from "@navikt/aksel-icons";

interface Props {
  to: string;
  tekst: string;
}

export default function Tilbakelenke({ to, tekst }: Props) {
  return (
    <div className="mt-2 mb-8">
      <Button
        as={Link}
        to={to}
        variant="tertiary"
        size="small"
        icon={<ArrowLeftIcon title="pil tilbake" fontSize="1.5rem" />}
      >
        {tekst}
      </Button>
    </div>
  );
}
