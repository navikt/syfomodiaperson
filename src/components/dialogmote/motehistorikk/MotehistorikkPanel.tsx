import { DialogmotePanel } from "../../mote/components/DialogmotePanel";
import { FortidenImage } from "../../../../img/ImageComponents";
import { FlexRow } from "../../Layout";
import React, { ReactElement, ReactNode, useState } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  DocumentComponentDto,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { Forhandsvisning } from "../Forhandsvisning";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import Lenke from "nav-frontend-lenker";
import { useTrackOnClick } from "@/data/logging/loggingHooks";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  avlystMote: "Avlysning av møte",
  avholdtMote: "Referat fra møte",
  referat: "Referat",
  avlysningsBrev: "Avlysningsbrev",
};

interface ForhandsvisDocumentLenkeProps {
  document: DocumentComponentDto[];
  title: string;
  children: ReactNode;
}

const ForhandsvisDocumentLenke = ({
  document,
  title,
  children,
}: ForhandsvisDocumentLenkeProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const trackOnClick = useTrackOnClick();
  return (
    <>
      <li>
        <Lenke
          data-cy={title}
          href="#0"
          onClick={() => {
            trackOnClick(title, texts.header);
            setModalIsOpen(true);
          }}
        >
          {children}
        </Lenke>
      </li>
      <Forhandsvisning
        title={title}
        contentLabel={title}
        isOpen={modalIsOpen}
        handleClose={() => setModalIsOpen(false)}
        getDocumentComponents={() => document}
      />
    </>
  );
};

interface MoteListElementProps {
  mote: DialogmoteDTO;
}

const MoteListElement = ({ mote }: MoteListElementProps): ReactElement => {
  const isMoteAvlyst = mote.status === DialogmoteStatus.AVLYST;
  const { ferdigstilteReferat } = useDialogmoteReferat(mote);
  const moteDatoTekst = tilDatoMedManedNavn(mote.tid);

  if (isMoteAvlyst) {
    const document =
      mote.arbeidstaker.varselList.find(
        (varsel) => varsel.varselType === MotedeltakerVarselType.AVLYST
      )?.document || [];

    return (
      <ForhandsvisDocumentLenke
        document={document}
        title={texts.avlysningsBrev}
      >
        {`${texts.avlystMote} ${moteDatoTekst}`}
      </ForhandsvisDocumentLenke>
    );
  }

  return (
    <>
      {ferdigstilteReferat.map((referat, index) => {
        const suffix = referat.endring
          ? ` - Endret ${tilDatoMedManedNavn(referat.updatedAt)}`
          : "";

        return (
          <ForhandsvisDocumentLenke
            key={index}
            document={referat.document}
            title={texts.referat}
          >
            {`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}
          </ForhandsvisDocumentLenke>
        );
      })}
    </>
  );
};

const UlWithoutIndentation = styled.ul`
  padding-left: 1.2em;
  margin: 0.5em;
`;

interface MotehistorikkPanelProps {
  historiskeMoter: DialogmoteDTO[];
}

export const MotehistorikkPanel = ({
  historiskeMoter,
}: MotehistorikkPanelProps) => {
  if (historiskeMoter.length === 0) return <></>;

  return (
    <DialogmotePanel
      icon={FortidenImage}
      header={texts.header}
      subtitle={texts.subtitle}
    >
      <FlexRow>
        <UlWithoutIndentation>
          {historiskeMoter.map((mote, index) => (
            <MoteListElement key={index} mote={mote} />
          ))}
        </UlWithoutIndentation>
      </FlexRow>
    </DialogmotePanel>
  );
};
