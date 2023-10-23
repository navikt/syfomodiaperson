import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  BodyLong,
  Button,
  Heading,
  HelpText,
  Link,
  Panel,
} from "@navikt/ds-react";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import styled from "styled-components";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import {
  useBehandlePersonoppgave,
  useBehandlePersonoppgaveWithoutInvalidate,
} from "@/data/personoppgave/useBehandlePersonoppgave";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import {
  tilLesbarDatoUtenArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";

const texts = {
  header: "Vurder bistandsbehovet fra behandler:",
  helptext: "Informasjonen er hentet fra felt 8 i sykmeldingen.",
  meldingTilNAV: "Melding til NAV",
  link: "Gå til sykmeldingen",
  behandleOppgaveText: "Jeg har vurdert bistandsbehovet, fjern oppgaven.",
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
  justify-content: space-between;
`;

const StyledBehandleOppgaveKnapp = styled(BehandlePersonOppgaveKnapp)`
  border: 0 !important;
  padding: 0 !important;
`;

export const HackathonOppgave = () => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const { isInitialLoading, isError, sykmeldinger } = useSykmeldingerQuery();
  const behandleOppgave = useBehandlePersonoppgaveWithoutInvalidate();
  const [isBehandlet, setIsBehandlet] = React.useState(false);

  const ubehandletSykmeldingOppgaver = oppgaver.filter(
    (oppgave) =>
      oppgave.type === PersonOppgaveType.BEHANDLER_BER_OM_BISTAND &&
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
                  placement="left"
                >
                  {texts.helptext}
                </HelpText>
              </StyledRow>
              <blockquote>
                {sykmelding?.meldingTilNav.navBoerTaTakISakenBegrunnelse}
              </blockquote>
              <StyledHarry>
                <Link href={`/sykefravaer/sykmeldinger/${sykmelding.id}`}>
                  {texts.link}
                </Link>
                {!isBehandlet ? (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      behandleOppgave.mutate(oppgave.uuid);
                      setIsBehandlet(true);
                    }}
                  >
                    {texts.behandleOppgaveText}
                  </Button>
                ) : (
                  <p>
                    Gratulerer, du klarte å fullføre oppgaven nå kan du ta helg!
                  </p>
                )}
              </StyledHarry>
            </StyledPanel>
          )
        );
      })}
    </>
  );
};
