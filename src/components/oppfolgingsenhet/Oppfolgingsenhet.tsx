import React, { ReactNode, useRef } from "react";
import { AlertProps, Box, HGrid } from "@navikt/ds-react";
import OppfolgingsenhetInnhold from "@/components/oppfolgingsenhet/OppfolgingsenhetInnhold";
import TildelOppfolgingsenhetModal from "@/components/oppfolgingsenhet/TildelOppfolgingsenhetModal";

interface Props {
  setTildeltOppfolgingsenhetNotification: (
    tildeltNotification: TildeltNotification | undefined
  ) => void;
}

export interface TildeltNotification extends Pick<AlertProps, "variant"> {
  header?: string;
  message: ReactNode;
}

export default function Oppfolgingsenhet({
  setTildeltOppfolgingsenhetNotification,
}: Props) {
  const tildelOppfolgingsenhetModalRef = useRef<HTMLDialogElement>(null);

  return (
    <Box background="surface-default" className="pt-4 pl-4 pr-4">
      <HGrid gap="4" columns={2} maxWidth={{ xl: "1440px" }}>
        <Box background="bg-subtle" borderRadius="large" padding="4">
          <OppfolgingsenhetInnhold modalRef={tildelOppfolgingsenhetModalRef} />
          <TildelOppfolgingsenhetModal
            modalRef={tildelOppfolgingsenhetModalRef}
            setTildeltNotification={setTildeltOppfolgingsenhetNotification}
          />
        </Box>
      </HGrid>
    </Box>
  );
}
