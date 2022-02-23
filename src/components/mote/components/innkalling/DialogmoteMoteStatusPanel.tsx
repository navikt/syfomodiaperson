import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import React, { ReactNode } from "react";
import { FlexRow, PaddingSize } from "../../../Layout";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Link } from "react-router-dom";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { TrackedHovedknapp } from "../../../buttons/TrackedHovedknapp";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Normaltekst } from "nav-frontend-typografi";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import dayjs from "dayjs";

const texts = {
  innkallingSendtTrackingContext: "Møtelandingsside: Sendt innkalling",
  headerInnkalling: "Innkallingen er sendt",
  headerEndring: "Endringen er sendt",
  headerMotedatoPassert: "Møtedato er passert",
  infoMessage:
    "Du har brukt den nye løsningen i Modia. Her kan du også avlyse, endre tidspunktet, og skrive referat.",
  endreMote: "Endre møtet",
  avlysMote: "Avlys møtet",
  skrivReferat: "Skriv referat",
  fortsettReferat: "Fortsett på referatet",
  moteTid: "Møtetidspunkt",
  moteSted: "Sted",
};

const Subtitle = (dialogmote: DialogmoteDTO): ReactNode => {
  const moteDatoTid = tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid);

  return (
    <>
      <Normaltekst>{`${texts.moteTid}: ${moteDatoTid}`}</Normaltekst>
      <Normaltekst>{`${texts.moteSted}: ${dialogmote.sted}`}</Normaltekst>
    </>
  );
};

const headerText = (dialogmote: DialogmoteDTO): string => {
  const moteDatoTid = dayjs(dialogmote.tid);
  const today = dayjs(new Date());
  if (moteDatoTid.isBefore(today, "date")) {
    return texts.headerMotedatoPassert;
  }

  return dialogmote.status === DialogmoteStatus.NYTT_TID_STED
    ? texts.headerEndring
    : texts.headerInnkalling;
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteMoteStatusPanel = ({ dialogmote }: Props) => {
  const referatKnappText =
    dialogmote.referat?.ferdigstilt === false
      ? texts.fortsettReferat
      : texts.skrivReferat;

  return (
    <DialogmotePanel
      icon={MoteIkonBlaaImage}
      subtitle={Subtitle(dialogmote)}
      header={headerText(dialogmote)}
    >
      <FlexRow>
        <DeltakereSvarInfo dialogmote={dialogmote} />
      </FlexRow>

      <FlexRow topPadding={PaddingSize.MD}>{texts.infoMessage}</FlexRow>

      <FlexRow topPadding={PaddingSize.MD}>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`}>
          <TrackedKnapp
            data-cy="endreMoteKnapp"
            context={texts.innkallingSendtTrackingContext}
          >
            {texts.endreMote}
          </TrackedKnapp>
        </Link>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/avlys`}>
          <TrackedKnapp
            data-cy="avlysMoteKnapp"
            context={texts.innkallingSendtTrackingContext}
          >
            {texts.avlysMote}
          </TrackedKnapp>
        </Link>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/referat`}>
          <TrackedHovedknapp
            data-cy="skrivReferatKnapp"
            context={texts.innkallingSendtTrackingContext}
          >
            {referatKnappText}
          </TrackedHovedknapp>
        </Link>
      </FlexRow>
    </DialogmotePanel>
  );
};
