import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import styled from "styled-components";
import React from "react";
import {
  BlueDocumentImage,
  BlyantImage,
} from "../../../../img/ImageComponents";
import Body from "@navikt/ds-react/esm/table/Body";

const text = {
  tilleggsopplysinger:
    "Tilleggsopplysninger vedørende pasienten. Behandleren honoreres med takst L8.",
  legeerklaring:
    "Legeerklæring vedørende pasienten. Behandleren honoreres med takst L46.",
};

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: row;
`;

interface Props {
  meldingType: MeldingType;
}

export const MeldingsTypeInfo = ({ meldingType }: Props) => {
  const Info = () => {
    switch (meldingType) {
      case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
        return (
          <>
            <Icon src={BlyantImage} />
            <Body>{text.tilleggsopplysinger}</Body>
          </>
        );
      case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
        return (
          <>
            <Icon src={BlueDocumentImage} />
            <Body>{text.legeerklaring}</Body>
          </>
        );
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
        return <></>; // Not supported
    }
  };

  return (
    <InfoPanel>
      <Info />
    </InfoPanel>
  );
};
