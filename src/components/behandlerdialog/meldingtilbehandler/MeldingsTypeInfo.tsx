import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import styled from "styled-components";
import React from "react";
import {
  BlueDocumentImage,
  BlyantImage,
} from "../../../../img/ImageComponents";

const text = {
  tilleggsopplysinger: {
    info: "Tilleggsopplysninger vedørende pasienten.",
    takst: "Behandleren honoreres med takst L8.",
  },
  legeerklaring: {
    info: "Legeerklæring vedørende pasienten.",
    takst: "Behandleren honoreres med takst L46.",
  },
};

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: row;
`;

interface MeldingsTypeInfoProps {
  meldingType: MeldingType;
}

export const MeldingsTypeInfo = ({ meldingType }: MeldingsTypeInfoProps) => {
  console.log(meldingType);
  const Ikon = () => {
    switch (meldingType) {
      case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
        return <Icon src={BlyantImage} />;
      case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
        return <Icon src={BlueDocumentImage} />;
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
        return null; // Not supported
    }
  };

  const Info = () => {
    function infoText() {
      switch (meldingType) {
        case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
          return text.tilleggsopplysinger;
        case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
          return text.legeerklaring;
        case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
          return null; // Not supported
      }
    }

    return (
      <div>
        <div>{infoText()?.info}</div>
        <div>{infoText()?.takst}</div>
      </div>
    );
  };

  return (
    <InfoPanel>
      <Ikon />
      <Info />
    </InfoPanel>
  );
};
