import React, { ReactElement } from "react";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { MoteDTO } from "@/data/mote/types/moteTypes";
import { SeMoteStatus } from "./SeMoteStatus";
import { NyttDialogMote } from "./NyttDialogMote";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import { useAktivtMoteplanleggerMote } from "@/data/mote/moter_hooks";
import { DialogmoteMoteStatusPanel } from "./DialogmoteMoteStatusPanel";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { DialogmoteunntakSkjemaLenke } from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaLenke";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";

export const texts = {
  bekreftetMote: "Bekreftet møte",
  seMotestatus: "Se møtestatus",
  planleggNyttMote: "Planlegg nytt dialogmøte",
  kandidatDialogmote: "Kandidat til dialogmøte",
  ingenMoterPlanlagt: "Ingen møter planlagt",
  dialogMote: "Dialogmøte",
  moteforesporselSendt: "Møteforespørsel sendt",
  arenaDialogmoteInnkalling:
    "Dialogmøter med denne innbyggeren må fortsatt kalles inn via Arena.",
};

const dialogmotePanelHeaderText = (isKandidat: boolean): string => {
  return isKandidat ? texts.kandidatDialogmote : texts.planleggNyttMote;
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
  const aktivtMoteplanleggerMote = useAktivtMoteplanleggerMote();
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();

  const { isKandidat } = useDialogmotekandidat();

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
        header={dialogmotePanelHeaderText(isKandidat)}
        subtitle={texts.ingenMoterPlanlagt}
      >
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        <FlexRow columnGap={FlexGapSize.MD}>
          <NyttDialogMote />
          {isKandidat && <DialogmoteunntakSkjemaLenke />}
        </FlexRow>
      </DialogmotePanel>
    );
  }
};
