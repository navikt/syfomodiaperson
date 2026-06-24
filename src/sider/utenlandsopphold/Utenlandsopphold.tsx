import React from "react";
import { Box } from "@navikt/ds-react";

const texts = {
  title: "Søknad om utenlandsopphold",
  goofyText:
    "Her kan du innvilge utenlandsopphold. Gitt mangel på knapper, må alt gjøres for hånd. Lykke til.",
};

export function Utenlandsopphold() {
  return (
    <Box
      background="default"
      padding="space-24"
      className="flex flex-col *:mb-4"
    >
      <h1>{texts.title}</h1>
      <p>{texts.goofyText}</p>
    </Box>
  );
}
