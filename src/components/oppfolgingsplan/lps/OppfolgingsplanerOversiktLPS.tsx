import React from "react";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import { restdatoTilLesbarDato, toDatePrettyPrint } from "@/utils/datoUtils";
import { isPersonOppgaveBehandlet } from "@/utils/personOppgaveUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import OppfolgingsplanLPSEtikett from "./OppfolgingsplanLPSEtikett";
import { StatusKanImage } from "../../../../img/ImageComponents";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "@/apiConstants";
import { useVeilederinfo } from "@/hooks/useVeilederinfo";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";

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

interface ButtonOpenPlanProps {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

export const ButtonOpenPlan = (buttonOpenPlanProps: ButtonOpenPlanProps) => {
  return (
    <a
      className="lenke"
      href={`${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/lps/${buttonOpenPlanProps.oppfolgingsplanLPS.uuid}`}
      download="oppfølgingsplan"
    >
      {texts.buttonOpenPlan}
    </a>
  );
};

interface BehandleOppfolgingsplanLPSProps {
  oppfolgingsplanLPSBistandsbehov: OppfolgingsplanLPS;
}

const OppfolgingsplanerOversiktLPS = ({
  oppfolgingsplanLPSBistandsbehov,
}: BehandleOppfolgingsplanLPSProps) => {
  const { veilederinfo } = useVeilederinfo();
  const personOppgave = oppfolgingsplanLPSBistandsbehov.personoppgave;
  const erPersonOppgaveBehandlet = isPersonOppgaveBehandlet(personOppgave);
  const { data: virksomhet } = useVirksomhetQuery(
    oppfolgingsplanLPSBistandsbehov.virksomhetsnummer
  );
  return (
    <LPSPlanPanel>
      <UnderTittelInline className="panel__tittel">
        {virksomhet?.navn}
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
      {veilederinfo && personOppgave && !erPersonOppgaveBehandlet && (
        <BehandleOppfolgingsplanLPS
          oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
          veilederIdent={veilederinfo.ident}
        />
      )}
      {personOppgave && erPersonOppgaveBehandlet && (
        <p>
          <span className="ferdigbehandlet__ikon">
            <img src={StatusKanImage} alt="Ferdig behandlet" />
          </span>{" "}
          {`Ferdigbehandlet: ${toDatePrettyPrint(
            personOppgave.behandletTidspunkt
          )} av ${personOppgave.behandletVeilederIdent}`}
        </p>
      )}
    </LPSPlanPanel>
  );
};

export default OppfolgingsplanerOversiktLPS;
