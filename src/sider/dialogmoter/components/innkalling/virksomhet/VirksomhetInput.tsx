import { TextField } from "@navikt/ds-react";
import { ReactElement } from "react";

const texts = {
  label: "Oppgi virksomhetsnummer",
};

interface VirksomhetInputProps {
  velgVirksomhet(virksomhetsnummer: string): void;
}

export const VirksomhetInput = ({
  velgVirksomhet,
}: VirksomhetInputProps): ReactElement => (
  <TextField
    className="mt-4 max-w-xs"
    id="virksomhetInput"
    label={texts.label}
    size="small"
    onChange={(e) => {
      velgVirksomhet(e.target.value);
    }}
  />
);
