import React, { ReactElement } from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { DialogmotePanel } from "@/components/mote/components/DialogmotePanel";
import { BlueDocumentImage } from "../../../img/ImageComponents";
import dayjs from "dayjs";
import {
  tilDatoMedManedNavnOgKlokkeslett,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
  tilLesbarDatoMedArstall,
} from "@/utils/datoUtils";
import { Normaltekst } from "nav-frontend-typografi";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Link } from "react-router-dom";

interface FerdigstilteReferatListProps {
  mote: DialogmoteDTO;
}

const FerdigstilteReferatList = ({ mote }: FerdigstilteReferatListProps) => {
  const { ferdigstilteReferat } = useDialogmoteReferat(mote);
  return (
    <ul>
      {ferdigstilteReferat.map((referat, index) => {
        const referatTekst = referat.endring ? "Endret referat" : "Referat";
        return (
          <li key={index}>
            {`${referatTekst}, sendt ${tilLesbarDatoMedArstall(
              referat.updatedAt
            )}`}
          </li>
        );
      })}
    </ul>
  );
};

interface EndreReferatPanelProps {
  mote: DialogmoteDTO;
}

const EndreReferatPanel = ({ mote }: EndreReferatPanelProps): ReactElement => {
  const endreReferatFrist = getEndreReferatFrist(mote);
  const { latestReferat } = useDialogmoteReferat(mote);
  return (
    <>
      <FerdigstilteReferatList mote={mote} />
      <FlexRow topPadding={PaddingSize.SM}>
        <Normaltekst>{`${texts.sisteFrist} ${tilDatoMedManedNavnOgKlokkeslett(
          endreReferatFrist
        )}`}</Normaltekst>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Link to={`${dialogmoteRoutePath}/${mote.uuid}/referat/endre`}>
          {latestReferat.ferdigstilt ? (
            <Knapp>{texts.buttonEndre}</Knapp>
          ) : (
            <Hovedknapp>{texts.buttonFullfor}</Hovedknapp>
          )}
        </Link>
      </FlexRow>
    </>
  );
};

const texts = {
  header: "Referatet er sendt",
  sisteFrist: "Siste frist for å sende ut en endring av dette referatet er",
  buttonEndre: "Endre referatet",
  buttonFullfor: "Fullfør endringen",
};

const ENDRE_REFERAT_FRIST_DAYS = 30;

const getEndreReferatFrist = (mote: DialogmoteDTO): Date =>
  dayjs(mote.tid).add(ENDRE_REFERAT_FRIST_DAYS, "days").toDate();

const kanEndreReferat = () => (mote: DialogmoteDTO): boolean => {
  const endreReferatFrist = getEndreReferatFrist(mote);
  const now = dayjs();
  return now.isBefore(endreReferatFrist);
};

interface DialogmoteReferatPanelProps {
  ferdigstilteMoter: DialogmoteDTO[];
}

export const DialogmoteFerdigstilteReferatPanel = ({
  ferdigstilteMoter,
}: DialogmoteReferatPanelProps): ReactElement => (
  <>
    {ferdigstilteMoter.filter(kanEndreReferat()).map((mote, index) => {
      const moteDatoTid = tilDatoMedUkedagOgManedNavnOgKlokkeslett(mote.tid);
      const subtitle = `Møtetidspunkt: ${moteDatoTid} - ${mote.sted}`;
      return (
        <DialogmotePanel
          key={index}
          icon={BlueDocumentImage}
          header={texts.header}
          subtitle={subtitle}
        >
          <EndreReferatPanel key={index} mote={mote} />
        </DialogmotePanel>
      );
    })}
  </>
);
