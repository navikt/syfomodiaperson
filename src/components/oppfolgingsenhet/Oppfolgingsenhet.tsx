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
    <Box background="default" className="pt-4 pl-4 pr-4">
      <HGrid gap="space-16" columns={2} maxWidth={{ xl: "1440px" }}>
        <Box background="neutral-soft" borderRadius="8" padding="space-16">
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
