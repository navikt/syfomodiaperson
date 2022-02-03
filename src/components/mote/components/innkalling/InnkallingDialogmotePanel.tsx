import React, { ReactElement } from "react";
import { MoteDTO } from "@/data/mote/types/moteTypes";
import { SeMoteStatus } from "./SeMoteStatus";
import { NyttDialogMote } from "./NyttDialogMote";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import { useAktivtMoteplanleggerMote } from "@/data/mote/moter_hooks";
import { Moteplanleggeren } from "./Moteplanleggeren";
import { DialogmoteMoteStatusPanel } from "./DialogmoteMoteStatusPanel";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

export const texts = {
  bekreftetMote: "Bekreftet møte",
  seMotestatus: "Se møtestatus",
  planleggNyttMote: "Planlegg nytt dialogmøte",
  ingenMoterPlanlagt: "Ingen møter planlagt",
  dialogMote: "Dialogmøte",
  moteforesporselSendt: "Møteforespørsel sendt",
  arenaDialogmoteInnkalling:
    "Dialogmøter med denne innbyggeren må fortsatt kalles inn via Arena.",
};

const resolveUndertittelForMoteStatus = (mote: MoteDTO) => {
  if (mote.status === "BEKREFTET" && mote.bekreftetAlternativ) {
    return `${texts.dialogMote} ${tilDatoMedUkedagOgManedNavn(
      mote.bekreftetAlternativ.tid
    )}`;
  } else {
    return `${texts.moteforesporselSendt} ${tilDatoMedUkedagOgManedNavn(
      mote.opprettetTidspunkt
    )}`;
  }
};

interface InnkallingDialogmotePanelProps {
  aktivtDialogmote: DialogmoteDTO | undefined;
}

export const InnkallingDialogmotePanel = ({
  aktivtDialogmote,
}: InnkallingDialogmotePanelProps): ReactElement => {
  const { isDm2Enabled } = useDM2FeatureToggles();
  const aktivtMoteplanleggerMote = useAktivtMoteplanleggerMote();
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();

  if (!isDm2Enabled) {
    return <Moteplanleggeren />;
  }

  if (aktivtDialogmote) {
    return <DialogmoteMoteStatusPanel dialogmote={aktivtDialogmote} />;
  } else if (aktivtMoteplanleggerMote) {
    return (
      <DialogmotePanel
        icon={MoteIkonBlaaImage}
        header={
          aktivtMoteplanleggerMote.status === "BEKREFTET"
            ? texts.bekreftetMote
            : texts.seMotestatus
        }
        subtitle={resolveUndertittelForMoteStatus(aktivtMoteplanleggerMote)}
      >
        <SeMoteStatus />
      </DialogmotePanel>
    );
  } else {
    return (
      <DialogmotePanel
        icon={MoteIkonBlaaImage}
        header={texts.planleggNyttMote}
        subtitle={texts.ingenMoterPlanlagt}
      >
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        <NyttDialogMote />
      </DialogmotePanel>
    );
  }
};
