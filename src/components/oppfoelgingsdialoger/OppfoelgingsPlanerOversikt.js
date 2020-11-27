import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { tilLesbarPeriodeMedArstall } from "@navikt/digisyfo-npm";
import Alertstripe from "nav-frontend-alertstriper";
import Sidetopp from "../Sidetopp";
import {
  erIdag,
  erIkkeIdag,
  leggTilDagerPaDato,
  restdatoTilLesbarDato,
} from "../../utils/datoUtils";
import { hentVirksomhet } from "../../actions/virksomhet_actions";
import OppfolgingsplanerOversiktLPS from "../oppfolgingsplan/lps/OppfolgingsplanerOversiktLPS";

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

const durationText = (dialog) => {
  return `${texts.duration} ${tilLesbarPeriodeMedArstall(
    dialog.godkjentPlan.gyldighetstidspunkt.fom,
    dialog.godkjentPlan.gyldighetstidspunkt.tom
  )}`;
};

const deltMedNavText = (dialog) => {
  const sharedDate =
    dialog.godkjentPlan &&
    restdatoTilLesbarDato(dialog.godkjentPlan.deltMedNAVTidspunkt);
  return `${texts.shared} ${sharedDate}`;
};

const OppfoelgingsPlanerOversikt = ({
  fnr,
  aktiveDialoger,
  inaktiveDialoger,
  oppfolgingsplanerLPS,
  veilederIdent,
}) => {
  const dispatch = useDispatch();

  const oppfolgingsplanerLPSUnprocessed = oppfolgingsplanerLPS
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        if (oppfolgingsplanLPS.personoppgave.behandletTidspunkt) {
          return (
            Date.now() <
            leggTilDagerPaDato(
              oppfolgingsplanLPS.personoppgave.behandletTidspunkt,
              1
            )
          );
        }
        return !oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet) - new Date(b.opprettet);
    });

  const oppfolgingsplanerLPSProcessed = oppfolgingsplanerLPS
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        return oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIkkeIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet) - new Date(b.opprettet);
    });

  useEffect(() => {
    const virksomhetsnummerSet = new Set();
    aktiveDialoger.forEach((plan) => {
      virksomhetsnummerSet.add(plan.virksomhet.virksomhetsnummer);
    });
    inaktiveDialoger.forEach((plan) => {
      virksomhetsnummerSet.add(plan.virksomhet.virksomhetsnummer);
    });
    oppfolgingsplanerLPS.forEach((planLPS) => {
      virksomhetsnummerSet.add(planLPS.virksomhetsnummer);
    });
    virksomhetsnummerSet.forEach((virksomhetsnummer) => {
      dispatch(hentVirksomhet(virksomhetsnummer));
    });
  }, []);

  aktiveDialoger.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt) -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt)
    );
  });

  inaktiveDialoger.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt) -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt)
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
              fnr={fnr}
              oppfolgingsplanLPSBistandsbehov={planLPS}
              veilederIdent={veilederIdent}
            />
          );
        })}
        {aktiveDialoger.map((dialog, index) => {
          return (
            <Link
              key={index}
              className="navigasjonspanel navigasjonspanel--stor"
              to={`/sykefravaer/${fnr}/oppfoelgingsplaner/${dialog.id}`}
            >
              <div className="navigasjonselement">
                <h3 className="panel__tittel navigasjonselement__tittel">
                  {dialog.virksomhet.navn}
                </h3>
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
            to={`/sykefravaer/${fnr}/oppfoelgingsplaner/${dialog.id}`}
          >
            <div className="navigasjonselement">
              <h3 className="panel__tittel navigasjonselement__tittel">
                {dialog.virksomhet.navn}
              </h3>
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
            fnr={fnr}
            oppfolgingsplanLPSBistandsbehov={planLPS}
            veilederIdent={veilederIdent}
          />
        );
      })}
    </div>
  );
};

OppfoelgingsPlanerOversikt.propTypes = {
  fnr: PropTypes.string,
  aktiveDialoger: PropTypes.array.isRequired,
  inaktiveDialoger: PropTypes.array.isRequired,
  oppfolgingsplanerLPS: PropTypes.array.isRequired,
  veilederIdent: PropTypes.string,
};

export default OppfoelgingsPlanerOversikt;
