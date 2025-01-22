import React from "react";
import dayjs from "dayjs";
import Alertstripe from "nav-frontend-alertstriper";
import Sidetopp from "../../../components/Sidetopp";
import { erIdag, erIkkeIdag } from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { Heading } from "@navikt/ds-react";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import BeOmOppfolgingsplan from "@/sider/oppfolgingsplan/oppfolgingsplaner/BeOmOppfolgingsplan";

const texts = {
  titles: {
    relevantOppfolgingsplaner: "Aktive oppfølgingsplaner",
    inactiveOppfolgingsplaner: "Tidligere oppfølgingsplaner",
    lpsOppfolgingsplaner: "Oppfølgingsplaner med bistandsbehov",
  },
  alertMessages: {
    noRelevantOppfolgingsplaner: "Det er ingen aktive oppfølgingsplaner.",
    noInactiveOppfolgingsplaner: "Det er ingen tidligere oppfølgingsplaner.",
    noLPSOppfolgingsplaner: "Det er ingen oppfølgingsplaner med bistandsbehov",
  },
};

function activeNarmesteLederForCurrentOppfolgingstilfelle(
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
  inaktivePlaner: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingsplanerLPS: OppfolgingsplanLPS[];
}

export default function OppfolgingsplanerOversikt(props: Props) {
  const { toggles } = useFeatureToggles();
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const { currentLedere } = useLedereQuery();
  const { latestOppfolgingstilfelle, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const currentOppfolgingstillfelle = hasActiveOppfolgingstilfelle
    ? latestOppfolgingstilfelle
    : undefined;

  const { aktivePlaner, inaktivePlaner, oppfolgingsplanerLPS } = props;
  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(oppfolgingsplanLPS, personoppgaver)
  );

  const oppfolgingsplanerLPSUnprocessed = oppfolgingsplanerLPSMedPersonOppgave
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

  const oppfolgingsplanerLPSProcessed = oppfolgingsplanerLPSMedPersonOppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        return oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIkkeIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();
    });

  aktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  inaktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  const hasNoActivePlans =
    aktivePlaner.length === 0 && oppfolgingsplanerLPSUnprocessed.length === 0;
  const hasNoInactivePlans =
    inaktivePlaner.length === 0 && oppfolgingsplanerLPSProcessed.length === 0;

  const activeNarmesteLedere = !!currentOppfolgingstillfelle
    ? activeNarmesteLederForCurrentOppfolgingstilfelle(
        currentLedere,
        currentOppfolgingstillfelle
      )
    : [];
  const activeNarmesteLederIfSingle =
    activeNarmesteLedere.length === 1 ? activeNarmesteLedere[0] : undefined;
  const isBeOmOppfolgingsplanEnabled =
    toggles.isBeOmOppfolgingsplanEnabled &&
    !!currentOppfolgingstillfelle &&
    !!activeNarmesteLederIfSingle;

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
      {isBeOmOppfolgingsplanEnabled && (
        <BeOmOppfolgingsplan
          aktivNarmesteLeder={activeNarmesteLederIfSingle}
          currentOppfolgingstilfelle={currentOppfolgingstillfelle}
        />
      )}

      <div className="mb-8">
        <Heading spacing level="2" size="medium">
          {texts.titles.relevantOppfolgingsplaner}
        </Heading>
        {hasNoActivePlans && (
          <Alertstripe type="info">
            <p>{texts.alertMessages.noRelevantOppfolgingsplaner}</p>
          </Alertstripe>
        )}
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
      </div>

      <Heading spacing level="2" size="medium">
        {texts.titles.inactiveOppfolgingsplaner}
      </Heading>
      {hasNoInactivePlans && (
        <Alertstripe type="info">
          <p>{texts.alertMessages.noInactiveOppfolgingsplaner}</p>
        </Alertstripe>
      )}
      {inaktivePlaner.map((dialog, index) => {
        return <OppfolgingsplanLink key={index} dialog={dialog} />;
      })}
      {oppfolgingsplanerLPSProcessed.map((planLPS, index) => {
        return (
          <OppfolgingsplanerOversiktLPS
            key={index}
            oppfolgingsplanLPSBistandsbehov={planLPS}
          />
        );
      })}
    </div>
  );
}
