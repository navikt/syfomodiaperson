import TildelOppfolgingsenhetModal from "@/components/tildele/oppfolgingsenhet/TildelOppfolgingsenhetModal";
import React, { ReactNode, useRef } from "react";
import { OppfolgingsenhetInnhold } from "@/components/tildele/oppfolgingsenhet/OppfolgingsenhetInnhold";
import { AlertProps, Box } from "@navikt/ds-react";

interface Props {
  setTildeltNotification: (
    tildeltNotification: TildeltNotification | undefined
  ) => void;
}

export interface TildeltNotification extends Pick<AlertProps, "variant"> {
  header?: string;
  message: ReactNode;
}

export default function Oppfolgingsenhet({ setTildeltNotification }: Props) {
  const tildelOppfolgingsenhetModalRef = useRef<HTMLDialogElement>(null);

  return (
    <Box background="bg-subtle" borderRadius="large" padding="4">
      <OppfolgingsenhetInnhold modalRef={tildelOppfolgingsenhetModalRef} />
      <TildelOppfolgingsenhetModal
        modalRef={tildelOppfolgingsenhetModalRef}
        setTildeltNotification={setTildeltNotification}
      />
    </Box>
  );
}
