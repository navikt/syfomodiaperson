import {
  MotebehovIkkeSvartImage,
  MotebehovKanImage,
  MoteIkonBlaaImage,
} from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import React, { ReactElement, ReactNode } from "react";
import Alertstripe from "nav-frontend-alertstriper";
import { FlexColumn, FlexRow, PaddingSize } from "../../../Layout";
import { InfoRow } from "../../../InfoRow";
import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Link } from "react-router-dom";
import { TrackedKnapp } from "../../../buttons/TrackedKnapp";
import { TrackedHovedknapp } from "../../../buttons/TrackedHovedknapp";
import { useLedere } from "@/hooks/useLedere";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Normaltekst } from "nav-frontend-typografi";

const texts = {
  innkallingSendtTrackingContext: "Møtelandingsside: Sendt innkalling",
  header: "Innkallingen er sendt",
  infoMessage:
    "Du har brukt den nye løsningen i Modia. Her kan du også avlyse, endre tidspunktet, og skrive referat.",
  endreMote: "Endre møtet",
  avlysMote: "Avlys møtet",
  skrivReferat: "Skriv referat",
  naermesteLeder: "Nærmeste leder:",
  denSykmeldte: "Den sykmeldte:",
  harLestInnkalling: " har åpnet innkallingen",
  harIkkeLestInnkalling: " har ikke åpnet innkallingen",
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

const getHarLestIcon = (harLest: boolean): string => {
  return harLest ? MotebehovKanImage : MotebehovIkkeSvartImage;
};

const getHarLestText = (harLest: boolean): string => {
  return harLest ? texts.harLestInnkalling : texts.harIkkeLestInnkalling;
};

function isLestInnkalling(
  varselList:
    | DialogmotedeltakerArbeidstakerVarselDTO[]
    | DialogmotedeltakerArbeidsgiverVarselDTO[]
): boolean {
  return varselList.some(
    (varsel) =>
      varsel.varselType === MotedeltakerVarselType.INNKALT && !!varsel.lestDato
  );
}

interface ParticipantProps {
  dialogmote: DialogmoteDTO;
  bruker: Brukerinfo;
}

const ParticipantInfo = ({
  dialogmote,
  bruker,
}: ParticipantProps): ReactElement => {
  const arbeidstakerHarLestInnkallingen = isLestInnkalling(
    dialogmote.arbeidstaker.varselList
  );
  const arbeidsgiverHarLestInnkallingen = isLestInnkalling(
    dialogmote.arbeidsgiver.varselList
  );

  const { getCurrentNarmesteLeder } = useLedere();
  const narmesteLederNavn = getCurrentNarmesteLeder(
    dialogmote.arbeidsgiver.virksomhetsnummer
  )?.narmesteLederNavn;

  return (
    <FlexColumn>
      <InfoRow
        icon={getHarLestIcon(arbeidsgiverHarLestInnkallingen)}
        title={
          <span>
            <b>{texts.naermesteLeder}</b> {narmesteLederNavn ?? ""},
            {getHarLestText(arbeidsgiverHarLestInnkallingen)}
          </span>
        }
      />
      <InfoRow
        icon={getHarLestIcon(arbeidstakerHarLestInnkallingen)}
        title={
          <span>
            <b>{texts.denSykmeldte}</b> {bruker.navn},
            {getHarLestText(arbeidstakerHarLestInnkallingen)}
          </span>
        }
        topPadding={PaddingSize.SM}
      />
    </FlexColumn>
  );
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteMoteStatusPanel = ({ dialogmote }: Props) => {
  const bruker = useNavBrukerData();

  return (
    <DialogmotePanel
      icon={MoteIkonBlaaImage}
      header={texts.header}
      subtitle={Subtitle(dialogmote)}
    >
      <FlexRow>
        <ParticipantInfo dialogmote={dialogmote} bruker={bruker} />
      </FlexRow>

      <FlexRow topPadding={PaddingSize.MD}>
        <Alertstripe type="advarsel">{texts.infoMessage}</Alertstripe>
      </FlexRow>

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
            {texts.skrivReferat}
          </TrackedHovedknapp>
        </Link>
      </FlexRow>
    </DialogmotePanel>
  );
};
