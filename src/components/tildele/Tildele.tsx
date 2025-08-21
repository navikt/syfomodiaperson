import { Box, HGrid } from "@navikt/ds-react";
import React from "react";
import Oppfolgingsenhet, {
  TildeltNotification,
} from "@/components/tildele/oppfolgingsenhet/Oppfolgingsenhet";

interface Props {
  setTildeltOppfolgingsenhetNotification: (
    tildeltNotification: TildeltNotification | undefined
  ) => void;
}

export default function Tildele({
  setTildeltOppfolgingsenhetNotification,
}: Props) {
  return (
    <Box background="surface-default" padding={"4"}>
      <HGrid gap={"4"} columns={2} maxWidth={{ xl: "1440px" }}>
        <Oppfolgingsenhet
          setTildeltNotification={setTildeltOppfolgingsenhetNotification}
        />
      </HGrid>
    </Box>
  );
}
