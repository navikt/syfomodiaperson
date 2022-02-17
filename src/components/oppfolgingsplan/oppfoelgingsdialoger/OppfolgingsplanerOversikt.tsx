import React from "react";
import { Link } from "react-router-dom";
import Alertstripe from "nav-frontend-alertstriper";
import Sidetopp from "../../Sidetopp";
import {
  erIdag,
  erIkkeIdag,
  leggTilDagerPaDato,
  restdatoTilLesbarDato,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

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
  duration: "Varighet",
  shared: "Delt med NAV",
};

const durationText = (plan: OppfolgingsplanDTO) => {
  return `${texts.duration} ${tilLesbarPeriodeMedArstall(
    plan.godkjentPlan.gyldighetstidspunkt.fom,
    plan.godkjentPlan.gyldighetstidspunkt.tom
  )}`;
};

const deltMedNavText = (plan: OppfolgingsplanDTO) => {
  const sharedDate =
    plan.godkjentPlan &&
    restdatoTilLesbarDato(plan.godkjentPlan.deltMedNAVTidspunkt);
  return `${texts.shared} ${sharedDate}`;
};

interface OppfolgingsplanVirksomhetTittelProps {
  plan: OppfolgingsplanDTO;
}

const OppfolgingsplanVirksomhetTittel = ({
  plan,
}: OppfolgingsplanVirksomhetTittelProps) => {
  const { data: virksomhet } = useVirksomhetQuery(
    plan.virksomhet.virksomhetsnummer
  );
  return (
    <h3 className="panel__tittel navigasjonselement__tittel">
      {virksomhet?.navn}
    </h3>
  );
};

interface OppfolgingsplanerOversiktProps {
  aktiveDialoger: OppfolgingsplanDTO[];
  inaktiveDialoger: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingsplanerLPS: OppfolgingsplanLPS[];
}

type OppfolgingsplanLPSMedPersonoppgave = OppfolgingsplanLPS & {
  personoppgave?: PersonOppgave;
};

const toOppfolgingsplanLPSMedPersonoppgave = (
  oppfolgingsplanLPS: OppfolgingsplanLPS,
  personoppgaver: PersonOppgave[]
): OppfolgingsplanLPSMedPersonoppgave => {
  const personoppgave = personoppgaver.find(
    (personoppgave) => personoppgave.referanseUuid === oppfolgingsplanLPS.uuid
  );

  if (personoppgave) {
    return {
      ...oppfolgingsplanLPS,
      personoppgave,
    };
  }

  return oppfolgingsplanLPS;
};

const OppfolgingsplanerOversikt = (
  oppfolgingsplanerOversiktProps: OppfolgingsplanerOversiktProps
) => {
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const {
    aktiveDialoger,
    inaktiveDialoger,
    oppfolgingsplanerLPS,
  } = oppfolgingsplanerOversiktProps;
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
            leggTilDagerPaDato(
              oppfolgingsplanLPS.personoppgave.behandletTidspunkt,
              1
            ).getTime()
          );
        }
        return !oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();
    });

  const oppfolgingsplanerLPSProcessed = oppfolgingsplanerLPSMedPersonOppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        return oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIkkeIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();
    });

  aktiveDialoger.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  inaktiveDialoger.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
      <div className="blokk--l">
        <h2 className="typo-systemtittel blokk--xs">
          {texts.titles.relevantOppfolgingsplaner}
        </h2>
        {aktiveDialoger.length === 0 &&
          oppfolgingsplanerLPSUnprocessed.length === 0 && (
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
        {aktiveDialoger.map((dialog, index) => {
          return (
            <Link
              key={index}
              className="navigasjonspanel navigasjonspanel--stor"
              to={`/sykefravaer/oppfoelgingsplaner/${dialog.id}`}
            >
              <div className="navigasjonselement">
                <OppfolgingsplanVirksomhetTittel plan={dialog} />
                <p className="navigasjonselement__undertittel">
                  {durationText(dialog)}
                </p>
                <p className="navigasjonselement__undertekst">
                  {deltMedNavText(dialog)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="typo-systemtittel blokk--xs">
        {texts.titles.inactiveOppfolgingsplaner}
      </h2>
      {inaktiveDialoger.length === 0 &&
        oppfolgingsplanerLPSProcessed.length === 0 && (
          <Alertstripe type="info">
            <p>{texts.alertMessages.noInactiveOppfolgingsplaner}</p>
          </Alertstripe>
        )}
      {inaktiveDialoger.map((dialog, index) => {
        return (
          <Link
            key={index}
            className="navigasjonspanel navigasjonspanel--stor"
            to={`/sykefravaer/oppfoelgingsplaner/${dialog.id}`}
          >
            <div className="navigasjonselement">
              <OppfolgingsplanVirksomhetTittel plan={dialog} />
              <p className="navigasjonselement__undertittel">
                {durationText(dialog)}
              </p>
              <p className="navigasjonselement__undertekst">
                {deltMedNavText(dialog)}
              </p>
            </div>
          </Link>
        );
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
};

export default OppfolgingsplanerOversikt;
