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
import OppfolgingsplanForesporsel from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanForesporsel";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

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

interface Props {
  aktivePlaner: OppfolgingsplanDTO[];
  inaktivePlaner: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingsplanerLPS: OppfolgingsplanLPS[];
}

export default function OppfolgingsplanerOversikt(props: Props) {
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const { data: aktivVeileder } = useAktivVeilederinfoQuery();
  const { currentLedere } = useLedereQuery();

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

  //TODO: Kan man ha flere narmeste ledere som bytter på ansvaret? Eller har man alltid en?
  //TODO: Hvor ofte skal man kunne be om oppfølgingsplan? Hvordan fungerer dette i arena i dag?
  const isSingleCurrentNarmesteLeader =
    currentLedere.map((leder) => leder.status === "INNMELDT_AKTIV").length ===
    1;

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
      {!!aktivVeileder && isSingleCurrentNarmesteLeader && (
        <OppfolgingsplanForesporsel aktivVeileder={aktivVeileder} />
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
