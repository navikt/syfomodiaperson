import React, { ReactElement, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import IngenBrukerContainer from "../containers/IngenBrukerContainer";
import MotebookingContainer from "../components/mote/container/MotebookingContainer";
import AvbrytMoteContainer from "../components/mote/container/AvbrytMoteContainer";
import BekreftMoteContainer from "../components/mote/container/BekreftMoteContainer";
import SykmeldingerContainer from "../components/speiling/sykmeldinger/container/SykmeldingerContainer";
import SykepengesoknaderContainer from "../components/speiling/sykepengsoknader/container/SykepengesoknaderSide";
import DinSykmeldingContainer from "../components/speiling/sykmeldinger/container/DinSykmeldingContainer";
import HistorikkContainer from "../components/historikk/container/HistorikkContainer";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import MotelandingssideContainer from "../components/mote/container/MotelandingssideContainer";
import NokkelinformasjonContainer from "../components/nokkelinformasjon/container/NokkelinformasjonContainer";
import VedtakContainer from "../components/vedtak/container/VedtakContainer";
import DialogmoteInnkallingContainer from "../components/dialogmote/innkalling/DialogmoteInnkallingContainer";
import AvlysDialogmoteContainer from "../components/dialogmote/avlys/AvlysDialogmoteContainer";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useDispatch } from "react-redux";
import {
  hentAktivBruker,
  pushModiaContext,
} from "@/data/modiacontext/modiacontext_actions";
import { EventType } from "@/data/modiacontext/modiacontextTypes";
import AppSpinner from "../components/AppSpinner";
import { useAppSelector } from "@/hooks/hooks";
import DialogmoteReferatContainer from "../components/dialogmote/referat/DialogmoteReferatContainer";
import { useUserProperties } from "@/data/logging/loggingHooks";
import { setAmplitudeUserProperties } from "@/amplitude/amplitude";
import EndreDialogmoteContainer from "../components/dialogmote/endre/EndreDialogmoteContainer";
import { fetchUnleashToggles } from "@/data/unleash/unleash_actions";
import { SykepengesoknadSide } from "@/components/speiling/sykepengsoknader/container/SykepengesoknadSide";
import { OppfoelgingsPlanerOversiktContainer } from "@/components/oppfolgingsplan/container/OppfoelgingsPlanerOversiktContainer";
import { OppfoelgingsplanContainer } from "@/components/oppfolgingsplan/container/OppfoelgingsplanContainer";

const getFnrFromParams = (): string => {
  return window.location.pathname.split("/")[2];
};

const AktivBrukerRouter = (): ReactElement => {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/sykefravaer" />
      </Route>
      <Route path="/sykefravaer" exact component={NokkelinformasjonContainer} />
      <Route
        path="/sykefravaer/nokkelinformasjon"
        exact
        component={NokkelinformasjonContainer}
      />
      <Route path="/sykefravaer/logg" component={HistorikkContainer} />
      <Route
        path="/sykefravaer/moteoversikt"
        exact
        component={MotelandingssideContainer}
      />
      <Route path="/sykefravaer/mote" exact component={MotebookingContainer} />
      <Route
        path="/sykefravaer/dialogmote"
        exact
        component={DialogmoteInnkallingContainer}
      />
      <Route
        path="/sykefravaer/dialogmote/:dialogmoteUuid/avlys"
        exact
        component={AvlysDialogmoteContainer}
      />
      <Route
        path="/sykefravaer/dialogmote/:dialogmoteUuid/referat"
        exact
        component={DialogmoteReferatContainer}
      />
      <Route
        path="/sykefravaer/dialogmote/:dialogmoteUuid/endre"
        exact
        component={EndreDialogmoteContainer}
      />
      <Route
        path="/sykefravaer/mote/:moteUuid/avbryt"
        exact
        component={AvbrytMoteContainer}
      />
      <Route
        path="/sykefravaer/mote/bekreft/:alternativId"
        exact
        component={BekreftMoteContainer}
      />
      <Route
        path="/sykefravaer/sykmeldinger"
        exact
        component={SykmeldingerContainer}
      />
      <Route
        path="/sykefravaer/sykepengesoknader"
        exact
        component={SykepengesoknaderContainer}
      />
      <Route
        path="/sykefravaer/sykepengesoknader/:sykepengesoknadId"
        exact
        component={SykepengesoknadSide}
      />
      <Route
        path="/sykefravaer/sykmeldinger/:sykmeldingId"
        exact
        component={DinSykmeldingContainer}
      />
      <Route
        path="/sykefravaer/oppfoelgingsplaner"
        exact
        component={OppfoelgingsPlanerOversiktContainer}
      />
      <Route
        path="/sykefravaer/oppfoelgingsplaner/:oppfoelgingsdialogId"
        exact
        component={OppfoelgingsplanContainer}
      />
      <Route path="/sykefravaer/vedtak" exact component={VedtakContainer} />
    </Router>
  );
};

const IngenAktivBrukerRouter = (): ReactElement => {
  return (
    <Router>
      <Route path="*" component={IngenBrukerContainer} />
    </Router>
  );
};

const AktivBrukerHentet = (): ReactElement => {
  const fnr = useValgtPersonident();
  if (!erGyldigFodselsnummer(fnr)) {
    return <IngenAktivBrukerRouter />;
  }
  return <AktivBrukerRouter />;
};

const AktivBrukerLoader = () => {
  const modiacontextState = useAppSelector((state) => state.modiacontext);
  const harForsoktHentetAktivBruker = modiacontextState.hentingBrukerForsokt;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!modiacontextState.henterBruker && !harForsoktHentetAktivBruker) {
      dispatch(hentAktivBruker());
    }
  });

  if (!harForsoktHentetAktivBruker) {
    return <AppSpinner />;
  }
  return <AktivBrukerHentet />;
};

const AppRouter = () => {
  const fnrFromParam = getFnrFromParams();
  const userProperties = useUserProperties();
  const veilederIdent = useAppSelector(
    (state) => state.veilederinfo.data?.ident
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (userProperties.valgtEnhet || veilederIdent) {
      dispatch(fetchUnleashToggles(userProperties.valgtEnhet, veilederIdent));
      setAmplitudeUserProperties(userProperties);
    }
  }, [dispatch, userProperties, veilederIdent]);

  useEffect(() => {
    if (erGyldigFodselsnummer(fnrFromParam)) {
      dispatch(
        pushModiaContext({
          verdi: fnrFromParam,
          eventType: EventType.NY_AKTIV_BRUKER,
        })
      );
    }
  }, [dispatch, fnrFromParam, userProperties.valgtEnhet]);

  return AktivBrukerLoader();
};

export default AppRouter;
