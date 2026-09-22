import UtdragFraSykefravaeretPanel from "../../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { MotebehovPanel } from "@/sider/dialogmoter/motebehov/MotebehovPanel";
import InnkallingDialogmotePanel from "@/sider/dialogmoter/components/innkalling/InnkallingDialogmotePanel";
import { DialogmoteFerdigstilteReferatPanel } from "@/sider/dialogmoter/components/DialogmoteFerdigstilteReferatPanel";
import { Fragment, ReactElement } from "react";

interface Panel {
  key: string;
  priority: number;
  element: ReactElement;
}

interface MotelandingssidePanelsProps {
  hasUbehandletMotebehov: boolean;
  aktivtDialogmote: DialogmoteDTO | undefined;
  ferdigstilteDialogmoter: DialogmoteDTO[];
}

export const MotelandingssidePanels = ({
  hasUbehandletMotebehov,
  aktivtDialogmote,
  ferdigstilteDialogmoter,
}: MotelandingssidePanelsProps) => {
  const panels: Panel[] = [
    {
      key: "motebehov",
      priority: hasUbehandletMotebehov ? 0 : 1,
      element: <MotebehovPanel />,
    },
    {
      key: "innkalling",
      priority: hasUbehandletMotebehov ? 1 : 0,
      element: (
        <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />
      ),
    },
    {
      key: "ferdigstilte-referat",
      priority: 2,
      element: (
        <DialogmoteFerdigstilteReferatPanel
          ferdigstilteMoter={ferdigstilteDialogmoter}
        />
      ),
    },
    {
      key: "utdrag-fra-sykefravaeret",
      priority: 3,
      element: <UtdragFraSykefravaeretPanel />,
    },
  ];
  const sortedPanels = panels.sort((a, b) => a.priority - b.priority);

  return (
    <>
      {sortedPanels.map((panel) => (
        <Fragment key={panel.key}>{panel.element}</Fragment>
      ))}
    </>
  );
};
