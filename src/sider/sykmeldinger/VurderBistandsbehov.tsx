import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  BodyShort,
  Button,
  Heading,
  HelpText,
  Link,
  Panel,
} from "@navikt/ds-react";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { useBehandlePersonoppgaveWithoutRefetch } from "@/data/personoppgave/useBehandlePersonoppgave";
import { StatusKanImage } from "../../../img/ImageComponents";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { Link as RouterLink } from "react-router-dom";

const texts = {
  header: "Vurder bistandsbehovet eller forslag til tiltak fra behandler:",
  helptext: "Informasjon fra felter i sykmeldingen fra behandler.",
  link: "Gå til sykmeldingen",
  behandleOppgaveText: "Jeg har vurdert behovet, fjern oppgaven.",
};

interface VurderBistandsbehovProps {
  oppgave: PersonOppgave;
}

const VurderBistandsbehov = ({ oppgave }: VurderBistandsbehovProps) => {
  const behandleOppgave = useBehandlePersonoppgaveWithoutRefetch();
  const { sykmeldinger } = useSykmeldingerQuery();

  const sykmelding = sykmeldinger.find(
    (sykmelding) => sykmelding.id === oppgave.referanseUuid
  );
  const tiltakNAV = sykmelding?.arbeidsevne.tiltakNAV;
  const tiltakAndre = sykmelding?.arbeidsevne.tiltakAndre;
  const bistandsbehov = sykmelding?.meldingTilNav.navBoerTaTakISakenBegrunnelse;
  return !!sykmelding ? (
    <Panel className={"mb-4"}>
      <div className={"flex flex-row justify-between"}>
        <Heading size="medium" level="2">
          {texts.header}
        </Heading>
        <HelpText
          title="Informasjon fra felter i sykmeldingen fra behandler"
          placement="left"
        >
          {texts.helptext}
        </HelpText>
      </div>
      <blockquote>
        <BodyShort>
          {tiltakNAV
            ? `Felt 7.2 (Forslag til tiltak i regi fra NAV): ${tiltakNAV}`
            : ""}
        </BodyShort>
        <BodyShort>
          {tiltakAndre
            ? `Felt 7.3 (Andre innspill til NAV): ${tiltakAndre}`
            : ""}
        </BodyShort>
        <BodyShort>
          {bistandsbehov ? `Felt 8.2 (Melding til NAV): ${bistandsbehov}` : ""}
        </BodyShort>
      </blockquote>
      <div className={"flex flex-row justify-between"}>
        <Link as={RouterLink} to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}>
          {texts.link}
        </Link>
        {!behandleOppgave.isSuccess ? (
          <Button
            variant="secondary"
            size="small"
            onClick={() => behandleOppgave.mutate(oppgave.uuid)}
            loading={behandleOppgave.isPending}
          >
            {texts.behandleOppgaveText}
          </Button>
        ) : (
          <div className={"flex flex-row justify-between"}>
            <span className={"mr-2"}>
              <img
                src={StatusKanImage}
                alt="Ferdig behandlet"
                className={"w-6 h-6"}
              />
            </span>
            <p>Ferdigbehandlet</p>
          </div>
        )}
      </div>
    </Panel>
  ) : null;
};
export const BistandsbehovOppgaver = () => {
  const { data: oppgaver } = usePersonoppgaverQuery();

  const ubehandletBistandsbehovOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND
  );

  return (
    <>
      {ubehandletBistandsbehovOppgaver.map((oppgave) => (
        <VurderBistandsbehov oppgave={oppgave} key={oppgave.uuid} />
      ))}
    </>
  );
};
