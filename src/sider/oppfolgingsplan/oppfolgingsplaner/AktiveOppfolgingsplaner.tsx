import { BodyShort, Box, Heading } from "@navikt/ds-react";
import React from "react";
import { erIdag } from "@/utils/datoUtils";
import dayjs from "dayjs";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { OppfolgingsplanLPSMedPersonoppgave } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import OppfolgingsplanerOversiktLPS from "@/sider/oppfolgingsplan/lps/OppfolgingsplanerOversiktLPS";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import BeOmOppfolgingsplan from "@/sider/oppfolgingsplan/oppfolgingsplaner/BeOmOppfolgingsplan";

const texts = {
  aktiveOppfolgingsplaner: "Aktive oppfølgingsplaner",
  ingenAktiveOppfolgingsplaner: "Det er ingen aktive oppfølgingsplaner",
};

export function activeNarmesteLederForCurrentOppfolgingstilfelle(
  ledere: NarmesteLederRelasjonDTO[],
  oppfolgingsTilfelle: OppfolgingstilfelleDTO
): NarmesteLederRelasjonDTO[] {
  return ledere.filter(
    (leder) =>
      leder.status === "INNMELDT_AKTIV" &&
      oppfolgingsTilfelle.virksomhetsnummerList.includes(
        leder.virksomhetsnummer
      )
  );
}

interface Props {
  aktivePlaner: OppfolgingsplanDTO[];
  oppfolgingsplanerLPSMedPersonoppgave: OppfolgingsplanLPSMedPersonoppgave[];
}

export default function AktiveOppfolgingsplaner({
  aktivePlaner,
  oppfolgingsplanerLPSMedPersonoppgave,
}: Props) {
  const { toggles } = useFeatureToggles();
  const { currentLedere } = useLedereQuery();

  const { latestOppfolgingstilfelle, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const currentOppfolgingstilfelle = hasActiveOppfolgingstilfelle
    ? latestOppfolgingstilfelle
    : undefined;

  const oppfolgingsplanerLPSUnprocessed = oppfolgingsplanerLPSMedPersonoppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        if (oppfolgingsplanLPS.personoppgave.behandletTidspunkt) {
          return (
            Date.now() <
            dayjs(oppfolgingsplanLPS.personoppgave.behandletTidspunkt)
              .add(1, "days")
              .toDate()
              .getTime()
          );
        }
        return !oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();
    });

  const hasActivePlan =
    aktivePlaner.length !== 0 || oppfolgingsplanerLPSUnprocessed.length !== 0;

  const activeNarmesteLedere = !!currentOppfolgingstilfelle
    ? activeNarmesteLederForCurrentOppfolgingstilfelle(
        currentLedere,
        currentOppfolgingstilfelle
      )
    : [];
  const activeNarmesteLedereWithoutActivePlan = activeNarmesteLedere.filter(
    (leder) =>
      !aktivePlaner.some(
        (plan) => plan.virksomhet.virksomhetsnummer === leder.virksomhetsnummer
      ) &&
      !oppfolgingsplanerLPSUnprocessed.some(
        (plan) => plan.virksomhetsnummer === leder.virksomhetsnummer
      )
  );
  const isBeOmOppfolgingsplanVisible =
    toggles.isBeOmOppfolgingsplanEnabled &&
    !!currentOppfolgingstilfelle &&
    activeNarmesteLedereWithoutActivePlan.length > 0;

  return (
    <div className="mb-8">
      <Heading spacing level="2" size="medium">
        {texts.aktiveOppfolgingsplaner}
      </Heading>
      {hasActivePlan ? (
        <>
          {oppfolgingsplanerLPSUnprocessed.map((planLPS, index) => {
            return (
              <OppfolgingsplanerOversiktLPS
                key={index}
                oppfolgingsplanLPSBistandsbehov={planLPS}
              />
            );
          })}
          {aktivePlaner.map((dialog, index) => {
            return <OppfolgingsplanLink key={index} dialog={dialog} />;
          })}
        </>
      ) : (
        <Box background="surface-default" className="p-4 mb-2">
          <BodyShort>{texts.ingenAktiveOppfolgingsplaner}</BodyShort>
        </Box>
      )}
      {isBeOmOppfolgingsplanVisible && (
        <BeOmOppfolgingsplan
          activeNarmesteLedere={activeNarmesteLedereWithoutActivePlan}
          currentOppfolgingstilfelle={currentOppfolgingstilfelle}
        />
      )}
    </div>
  );
}
