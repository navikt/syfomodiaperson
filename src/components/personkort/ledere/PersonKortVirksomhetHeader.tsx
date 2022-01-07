import React from "react";
import styled from "styled-components";
import EtikettBase from "nav-frontend-etiketter";
import { formaterOrgnr } from "@/utils";
import { lederHasActiveSykmelding } from "@/utils/ledereUtils";
import kanskjeBooleanTilJaNeiKanskje from "../kanskjeBooleanTilJaNeiKanskje";
import { FabrikkImage } from "../../../../img/ImageComponents";
import navFarger from "nav-frontend-core";

const texts = {
  activeSykmelding: "Sykmeldt nå",
};

const GridRow = styled.div`
  width: 100%;
  display: inline-grid;
  grid-template-columns: 4fr 2fr 2fr 2fr;
  grid-template-rows: 1fr;
  gap: 0em 0.5em;
  font-weight: 800;
`;

const FlexColumn = styled.div`
  display: flex;
  align-items: flex-end;
`;

const HeaderStyled = styled.div`
  background-color: ${navFarger.navGraBakgrunn};
  padding: 0.5em;
  border: none;
`;

const PersonKortVirksomhetLederHeaderStyled = styled.div`
  margin-bottom: 2em;
`;

const textVirksomhetsnummer = (orgnummer: string) => {
  return `Org.nr.: ${formaterOrgnr(orgnummer)}`;
};

const textForskuttering = (arbeidsgiverForskutterer?: boolean) => {
  return `Forsk.: ${kanskjeBooleanTilJaNeiKanskje(arbeidsgiverForskutterer)}`;
};

interface PersonKortVirksomhetHeaderProps {
  children?: any;
  arbeidsgiverForskutterer?: boolean;
  virksomhetsnavn: string;
  virksomhetsnummer: string;
  sykmeldinger: any[];
}

const PersonKortVirksomhetHeader = (
  personKortVirksomhetHeaderProps: PersonKortVirksomhetHeaderProps
) => {
  const {
    children,
    arbeidsgiverForskutterer,
    virksomhetsnavn,
    virksomhetsnummer,
    sykmeldinger,
  } = personKortVirksomhetHeaderProps;
  const virksomhetsnummerText = textVirksomhetsnummer(virksomhetsnummer);
  const forskutteringText = textForskuttering(arbeidsgiverForskutterer);
  const activeSykmeldingText =
    lederHasActiveSykmelding(virksomhetsnummer, sykmeldinger) &&
    texts.activeSykmelding;
  return (
    <PersonKortVirksomhetLederHeaderStyled>
      <HeaderStyled className="personkortElement__tittel">
        <img src={FabrikkImage} alt="Fabrikk" />
        <GridRow>
          <FlexColumn>{virksomhetsnavn}</FlexColumn>
          <FlexColumn>{virksomhetsnummerText}</FlexColumn>
          <FlexColumn>{forskutteringText}</FlexColumn>
          {activeSykmeldingText && (
            <FlexColumn>
              <EtikettBase
                className="personkortElement__tittelLabel"
                type="info"
              >
                {activeSykmeldingText}
              </EtikettBase>
            </FlexColumn>
          )}
        </GridRow>
      </HeaderStyled>
      {children}
    </PersonKortVirksomhetLederHeaderStyled>
  );
};

export default PersonKortVirksomhetHeader;
