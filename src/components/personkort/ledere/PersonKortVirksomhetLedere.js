import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Column } from "nav-frontend-grid";
import { EtikettLiten } from "nav-frontend-typografi";
import { restdatoTildato } from "../../../utils/datoUtils";
import PersonKortVirksomhetHeader from "./PersonKortVirksomhetHeader";

const texts = {
  name: "Navn",
  phone: "Telefon",
  email: "E-post",
  orgnummer: "Org.nummer",
  startDate: "Meldt inn",
  active: "Nåværende",
};

const RowFullWidth = styled(Row)`
  width: 100%;
  margin-bottom: 0.5em;
`;

const EtikettLitenUpper = styled(EtikettLiten)`
  text-transform: uppercase;
`;

export const PersonKortVirksomhetLederIngressRow = () => {
  return (
    <RowFullWidth>
      <Column className="col-sm-3">
        <EtikettLitenUpper>{texts.name}</EtikettLitenUpper>
      </Column>
      <Column className="col-sm-4">
        <EtikettLitenUpper>{texts.email}</EtikettLitenUpper>
      </Column>
      <Column className="col-sm-1">
        <EtikettLitenUpper>{texts.phone}</EtikettLitenUpper>
      </Column>
      <Column className="col-sm-2">
        <EtikettLitenUpper>{texts.startDate}</EtikettLitenUpper>
      </Column>
    </RowFullWidth>
  );
};

export const PersonKortVirksomhetLederColumn = ({
  colSize,
  text,
  isActive,
}) => {
  return (
    <Column className={`col-sm-${colSize}`}>
      <p>{isActive ? <b>{text}</b> : text}</p>
    </Column>
  );
};
PersonKortVirksomhetLederColumn.propTypes = {
  colSize: PropTypes.number,
  text: PropTypes.string,
  isActive: PropTypes.bool,
};

export const PersonKortVirksomhetLederRow = ({ leder, isActive }) => {
  return (
    <RowFullWidth>
      <PersonKortVirksomhetLederColumn
        colSize={3}
        text={leder.navn}
        isActive={isActive}
      />
      <PersonKortVirksomhetLederColumn
        colSize={4}
        text={leder.epost}
        isActive={isActive}
      />
      <PersonKortVirksomhetLederColumn
        colSize={1}
        text={leder.tlf}
        isActive={isActive}
      />
      {leder.fomDato && (
        <PersonKortVirksomhetLederColumn
          colSize={2}
          text={restdatoTildato(leder.fomDato)}
          isActive={isActive}
        />
      )}
      {isActive && (
        <PersonKortVirksomhetLederColumn
          colSize={2}
          text={texts.active}
          isActive={isActive}
        />
      )}
    </RowFullWidth>
  );
};
PersonKortVirksomhetLederRow.propTypes = {
  leder: PropTypes.object,
  isActive: PropTypes.bool,
};

const PersonKortVirksomhetLedere = ({
  sykmeldinger,
  virksomhetLederMap,
  virksomhetsnummer,
}) => {
  const currentLeder = virksomhetLederMap[virksomhetsnummer][0];
  return (
    <PersonKortVirksomhetHeader
      currentLeder={currentLeder}
      sykmeldinger={sykmeldinger}
    >
      <PersonKortVirksomhetLederIngressRow />
      {virksomhetLederMap[virksomhetsnummer].map((leder, idx) => {
        return (
          <PersonKortVirksomhetLederRow
            key={idx}
            leder={leder}
            isActive={idx === 0}
          />
        );
      })}
    </PersonKortVirksomhetHeader>
  );
};
PersonKortVirksomhetLedere.propTypes = {
  sykmeldinger: PropTypes.arrayOf(PropTypes.object),
  virksomhetLederMap: PropTypes.object,
  virksomhetsnummer: PropTypes.string,
};

export default PersonKortVirksomhetLedere;
