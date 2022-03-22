import { DialogmotePanel } from "../../mote/components/DialogmotePanel";
import { FortidenImage } from "../../../../img/ImageComponents";
import { FlexRow } from "../../Layout";
import React, { ReactElement, useState } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { Forhandsvisning } from "../Forhandsvisning";
import { Normaltekst } from "nav-frontend-typografi";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  avlystMote: "Avlyst møte",
  avholdtMote: "Avholdt møte",
  referat: "Referat",
  avlysningsBrev: "Avlysningsbrev",
};

const InlineNormaltekst = styled(Normaltekst)`
  display: inline;
`;

const FlatknappWithMargin = styled(TrackedFlatknapp)`
  margin-left: 1em;
`;

interface MoteListElementProps {
  children: DialogmoteDTO;
}

const MoteListElement = ({ children }: MoteListElementProps): ReactElement => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isMoteAvlyst = children.status === DialogmoteStatus.AVLYST;
  const forhandsVisningTitle = isMoteAvlyst
    ? texts.avlysningsBrev
    : texts.referat;
  const listElementLabel = isMoteAvlyst ? texts.avlystMote : texts.avholdtMote;
  const { ferdigstilteReferat } = useDialogmoteReferat(children);

  const documentComponents = isMoteAvlyst
    ? children.arbeidstaker.varselList.find(
        (varsel) => varsel.varselType === MotedeltakerVarselType.AVLYST
      )?.document
    : ferdigstilteReferat[0]?.document;

  return (
    <li>
      <InlineNormaltekst>
        {listElementLabel} {tilDatoMedUkedagOgManedNavn(children.tid)}
      </InlineNormaltekst>
      {documentComponents && (
        <>
          <Forhandsvisning
            title={forhandsVisningTitle}
            contentLabel={forhandsVisningTitle}
            isOpen={modalIsOpen}
            handleClose={() => setModalIsOpen(false)}
            getDocumentComponents={() => documentComponents}
          />
          <FlatknappWithMargin
            data-cy={forhandsVisningTitle}
            context={texts.header}
            mini
            htmlType="button"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            {forhandsVisningTitle}
          </FlatknappWithMargin>
        </>
      )}
    </li>
  );
};

const UlWithoutIndentation = styled.ul`
  padding-left: 1.2em;
  margin: 0;
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
            <MoteListElement key={index}>{mote}</MoteListElement>
          ))}
        </UlWithoutIndentation>
      </FlexRow>
    </DialogmotePanel>
  );
};
