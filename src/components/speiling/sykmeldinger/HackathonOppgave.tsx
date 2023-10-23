import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { BodyLong, Heading, HelpText, Link, Panel } from "@navikt/ds-react";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import styled from "styled-components";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";

const texts = {
  header: "Vurder bistandsbehovet fra behandler",
  helptext: "Informasjonen er hentet fra felt 8 i sykmeldingen.",
  meldingTilNAV: "Melding til NAV",
  link: "Gå til sykmelding",
  behandleOppgaveText: "Jeg har forstått, behandle oppgave",
};

const StyledPanel = styled(Panel)`
  margin-bottom: 1em;
`;

const StyledHarry = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  *:not(:last-child) {
    margin-right: 0.5em;
  }
`;

const StyledBehandleOppgaveKnapp = styled(BehandlePersonOppgaveKnapp)`
  border: 0 !important;
  padding: 0 !important;
`;

export const HackathonOppgave = () => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const { isInitialLoading, isError, sykmeldinger } = useSykmeldingerQuery();
  const behandleOppgave = useBehandlePersonoppgave();

  const ubehandletSykmeldingOppgaver = oppgaver.filter(
    (oppgave) =>
      oppgave.type === PersonOppgaveType.HACKATHON &&
      !oppgave.behandletTidspunkt
  );

  return (
    <>
      {ubehandletSykmeldingOppgaver.map((oppgave, index) => {
        const sykmelding = sykmeldinger.find(
          (sykmelding) => sykmelding.id === oppgave.referanseUuid
        );
        return (
          sykmelding && (
            <StyledPanel key={index}>
              <StyledRow>
                <Heading size="medium" level="2">
                  {texts.header}
                </Heading>
                <HelpText
                  title="Informasjon fra felt 8 i sykmeldingen"
                  placement="right"
                >
                  {texts.helptext}
                </HelpText>
              </StyledRow>
              <Heading size="small" level="3">
                {texts.meldingTilNAV}
              </Heading>
              <BodyLong>
                {sykmelding?.meldingTilNav.navBoerTaTakISakenBegrunnelse}
              </BodyLong>
              <StyledHarry>
                <Link href={`/sykefravaer/sykmeldinger/${sykmelding.id}`}>
                  {texts.link}
                </Link>
                <StyledBehandleOppgaveKnapp
                  personOppgave={oppgave}
                  behandleOppgaveText={texts.behandleOppgaveText}
                  handleBehandleOppgave={() =>
                    behandleOppgave.mutate(oppgave.uuid)
                  }
                  isBehandleOppgaveLoading={behandleOppgave.isLoading}
                  isBehandlet={isBehandletOppgave(oppgave)}
                />
              </StyledHarry>
            </StyledPanel>
          )
        );
      })}
    </>
  );
};
