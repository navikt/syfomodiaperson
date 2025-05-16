import { Card } from "@/components/Card";
import TildelOppfolgingsenhetModal from "@/components/personkort/tildele/oppfolgingsenhet/TildelOppfolgingsenhetModal";
import React, { ReactNode, useRef } from "react";
import { OppfolgingsenhetInnhold } from "@/components/personkort/tildele/oppfolgingsenhet/OppfolgingsenhetInnhold";
import { AlertProps } from "@navikt/ds-react";

interface Props {
  setTildeltNotification: (
    tildeltNotification: TildeltNotification | undefined
  ) => void;
}

export interface TildeltNotification extends Pick<AlertProps, "variant"> {
  header?: string;
  message: ReactNode;
}

export const Oppfolgingsenhet = ({ setTildeltNotification }: Props) => {
  const tildelOppfolgingsenhetModalRef = useRef<HTMLDialogElement>(null);

  return (
    <Card>
      <OppfolgingsenhetInnhold modalRef={tildelOppfolgingsenhetModalRef} />
      <TildelOppfolgingsenhetModal
        modalRef={tildelOppfolgingsenhetModalRef}
        setTildeltNotification={setTildeltNotification}
      />
    </Card>
  );
};
