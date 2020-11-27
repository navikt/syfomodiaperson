import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import { toDatePrettyPrint } from "@navikt/digisyfo-npm";
import { restdatoTilLesbarDato } from "../../../utils/datoUtils";
import { isPersonOppgaveBehandlet } from "../../../utils/personOppgaveUtils";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import OppfolgingsplanLPSEtikett from "./OppfolgingsplanLPSEtikett";

const texts = {
  buttonOpenPlan: "Åpne oppfølgingsplanen(pdf)",
};

const UnderTittelInline = styled.h3`
  display: inline-block;
`;

const DivMarginBottom = styled.div`
  margin-bottom: 1em;
`;

const LPSPlanPanel = styled(Panel)`
  margin-bottom: 0.5em;
  padding: 2em 4em 2em 2em;
`;

export const ButtonOpenPlan = ({ oppfolgingsplanLPS }) => {
  return (
    <a
      className="lenke"
      href={`${process.env.REACT_APP_OPPFOLGINGSPLANREST_ROOT}/internad/dokument/lps/${oppfolgingsplanLPS.uuid}`}
      download="oppfølgingsplan"
    >
      {texts.buttonOpenPlan}
    </a>
  );
};
ButtonOpenPlan.propTypes = {
  oppfolgingsplanLPS: PropTypes.object,
};

const getIkonsti = (filnavn) => {
  return `/sykefravaer/img/svg/${filnavn}`;
};

const Ikon = ({ ikon }) => {
  return (
    <span className="ferdigbehandlet__ikon">
      <img src={getIkonsti(ikon)} alt="Ferdig behandlet" />
    </span>
  );
};

Ikon.propTypes = {
  ikon: PropTypes.string.isRequired,
};

const OppfolgingsplanerOversiktLPS = ({
  oppfolgingsplanLPSBistandsbehov,
  veilederIdent,
}) => {
  const personOppgave = oppfolgingsplanLPSBistandsbehov.personoppgave;
  const erPersonOppgaveBehandlet = isPersonOppgaveBehandlet(personOppgave);
  return (
    <LPSPlanPanel>
      <UnderTittelInline className="panel__tittel">
        {oppfolgingsplanLPSBistandsbehov.virksomhetsnavn}
      </UnderTittelInline>
      <p>
        Mottatt:{" "}
        {restdatoTilLesbarDato(oppfolgingsplanLPSBistandsbehov.opprettet)}
      </p>
      <DivMarginBottom>
        <OppfolgingsplanLPSEtikett />
      </DivMarginBottom>
      <DivMarginBottom>
        <ButtonOpenPlan oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov} />
      </DivMarginBottom>
      {personOppgave && !erPersonOppgaveBehandlet && (
        <BehandleOppfolgingsplanLPS
          oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
          veilederIdent={veilederIdent}
        />
      )}
      {personOppgave && erPersonOppgaveBehandlet && (
        <p>
          <Ikon ikon="status--kan.svg" />{" "}
          {`Ferdigbehandlet: ${toDatePrettyPrint(
            personOppgave.behandletTidspunkt
          )} av ${personOppgave.behandletVeilederIdent}`}
        </p>
      )}
    </LPSPlanPanel>
  );
};
OppfolgingsplanerOversiktLPS.propTypes = {
  fnr: PropTypes.string,
  oppfolgingsplanLPSBistandsbehov: PropTypes.object.isRequired,
  veilederIdent: PropTypes.string,
};

export default OppfolgingsplanerOversiktLPS;
