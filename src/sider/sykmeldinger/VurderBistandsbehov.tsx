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
  Tag,
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
  helptextDuplicate:
    "Sykmeldingen har duplikate felter fra en tidligere sykmelding.",
  link: "Gå til sykmeldingen",
  linkDuplicate: "Gå til tidligere sykmelding med duplikate felter",
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
  const sykmeldingDuplikat = sykmeldinger.find(
    (sykmelding) => sykmelding.id === oppgave.duplikatReferanseUuid
  );
  const tiltakNav = sykmelding?.arbeidsevne.tiltakNAV;
  const tiltakAndre = sykmelding?.arbeidsevne.tiltakAndre;
  const bistandsbehov = sykmelding?.meldingTilNav.navBoerTaTakISakenBegrunnelse;
  return !!sykmelding ? (
    <Panel className={"mb-4"}>
      <div className={"flex flex-row justify-between"}>
        <Heading size="medium" level="2">
          {texts.header}
        </Heading>
        <div className="flex gap-2 items-center">
          {!!oppgave.duplikatReferanseUuid && (
            <Tag variant="warning-moderate">Mulig duplikat</Tag>
          )}
          <HelpText
            placement="bottom"
            title="Se mer informasjon om bistandsbehovet"
          >
            {!!oppgave.duplikatReferanseUuid
              ? texts.helptextDuplicate
              : texts.helptext}
          </HelpText>
        </div>
      </div>
      <blockquote>
        {tiltakNav && (
          <BodyShort>
            Felt 7.2 (Forslag til tiltak i regi fra Nav): {tiltakNav}
          </BodyShort>
        )}
        {tiltakAndre && (
          <BodyShort>
            Felt 7.3 (Andre innspill til Nav): {tiltakAndre}
          </BodyShort>
        )}
        {bistandsbehov && (
          <BodyShort>Felt 8.2 (Melding til Nav): {bistandsbehov}</BodyShort>
        )}
      </blockquote>
      <div className={"flex flex-row justify-between"}>
        <Link as={RouterLink} to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}>
          {texts.link}
        </Link>
        {sykmeldingDuplikat && (
          <Link
            as={RouterLink}
            to={`/sykefravaer/sykmeldinger/${sykmeldingDuplikat.id}`}
          >
            {texts.linkDuplicate}
          </Link>
        )}
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
