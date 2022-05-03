import React, { ReactElement, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import AktivBrukerTilgangLaster from "@/components/AktivBrukerTilgangLaster";
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
import AppSpinner from "../components/AppSpinner";
import DialogmoteReferatContainer from "../components/dialogmote/referat/DialogmoteReferatContainer";
import { useUserProperties } from "@/data/logging/loggingHooks";
import { setAmplitudeUserProperties } from "@/amplitude/amplitude";
import EndreDialogmoteContainer from "../components/dialogmote/endre/EndreDialogmoteContainer";
import { SykepengesoknadSide } from "@/components/speiling/sykepengsoknader/container/SykepengesoknadSide";
import { OppfoelgingsPlanerOversiktContainer } from "@/components/oppfolgingsplan/container/OppfoelgingsPlanerOversiktContainer";
import { OppfoelgingsplanContainer } from "@/components/oppfolgingsplan/container/OppfoelgingsplanContainer";
import { IngenBrukerSide } from "@/components/IngenBrukerSide";
import { MotebookingContainer } from "@/components/mote/container/MotebookingContainer";
import { usePushAktivBruker } from "@/data/modiacontext/usePushAktivBruker";
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";
import DialogmoteEndreReferatContainer from "@/components/dialogmote/referat/DialogmoteEndreReferatContainer";
import DialogmoteunntakSkjemaContainer from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaContainer";

const getFnrFromParams = (): string => {
  return window.location.pathname.split("/")[2];
};

export const appRoutePath = "/sykefravaer";

export const dialogmoteRoutePath = `${appRoutePath}/dialogmote`;
export const dialogmoteUnntakRoutePath = `${appRoutePath}/dialogmoteunntak`;
export const moteoversiktRoutePath = `${appRoutePath}/moteoversikt`;

const AktivBrukerRouter = ({ fnr }: { fnr: string }): ReactElement => {
  return (
    <AktivBrukerTilgangLaster>
      <Router>
        <Route exact path="/">
          <Redirect to={appRoutePath} />
        </Route>
        <Route
          path={appRoutePath}
          exact
          component={NokkelinformasjonContainer}
        />
        <Route
          path={`${appRoutePath}/nokkelinformasjon`}
          exact
          component={NokkelinformasjonContainer}
        />
        <Route path={`${appRoutePath}/logg`} component={HistorikkContainer} />
        <Route
          path={moteoversiktRoutePath}
          exact
          component={MotelandingssideContainer}
        />
        <Route
          path={`${appRoutePath}/mote`}
          exact
          component={MotebookingContainer}
        />
        <Route
          path={dialogmoteRoutePath}
          exact
          component={DialogmoteInnkallingContainer}
        />
        <Route
          path={`${dialogmoteRoutePath}/:dialogmoteUuid/avlys`}
          exact
          component={AvlysDialogmoteContainer}
        />
        <Route
          path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat`}
          exact
          component={DialogmoteReferatContainer}
        />
        <Route
          path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat/endre`}
          exact
          component={DialogmoteEndreReferatContainer}
        />
        <Route
          path={`${dialogmoteRoutePath}/:dialogmoteUuid/endre`}
          exact
          component={EndreDialogmoteContainer}
        />
        <Route
          path={dialogmoteUnntakRoutePath}
          exact
          component={DialogmoteunntakSkjemaContainer}
        />
        <Route
          path={`${appRoutePath}/mote/:moteUuid/avbryt`}
          exact
          render={() => <AvbrytMoteContainer fnr={fnr} />}
        />
        <Route
          path={`${appRoutePath}/mote/bekreft/:alternativId`}
          exact
          render={() => <BekreftMoteContainer fnr={fnr} />}
        />
        <Route
          path={`${appRoutePath}/sykmeldinger`}
          exact
          component={SykmeldingerContainer}
        />
        <Route
          path={`${appRoutePath}/sykepengesoknader`}
          exact
          component={SykepengesoknaderContainer}
        />
        <Route
          path={`${appRoutePath}/sykepengesoknader/:sykepengesoknadId`}
          exact
          component={SykepengesoknadSide}
        />
        <Route
          path={`${appRoutePath}/sykmeldinger/:sykmeldingId`}
          exact
          component={DinSykmeldingContainer}
        />
        <Route
          path={`${appRoutePath}/oppfoelgingsplaner`}
          exact
          component={OppfoelgingsPlanerOversiktContainer}
        />
        <Route
          path={`${appRoutePath}/oppfoelgingsplaner/:oppfoelgingsdialogId`}
          exact
          component={OppfoelgingsplanContainer}
        />
        <Route
          path={`${appRoutePath}/vedtak`}
          exact
          component={VedtakContainer}
        />
      </Router>
    </AktivBrukerTilgangLaster>
  );
};

const IngenAktivBrukerRouter = (): ReactElement => {
  return (
    <Router>
      <Route path="*" component={IngenBrukerSide} />
    </Router>
  );
};

const AktivBrukerLoader = () => {
  const { isLoading, data } = useAktivBruker();

  if (isLoading) {
    return <AppSpinner />;
  }

  if (!data || !erGyldigFodselsnummer(data.aktivBruker)) {
    return <IngenAktivBrukerRouter />;
  } else {
    return <AktivBrukerRouter fnr={data.aktivBruker} />;
  }
};

const AppRouter = () => {
  const fnrFromParam = getFnrFromParams();
  const userProperties = useUserProperties();
  const { mutate: pushAktivBruker } = usePushAktivBruker(fnrFromParam);

  useEffect(() => {
    if (userProperties.valgtEnhet) {
      setAmplitudeUserProperties(userProperties);
    }
  }, [userProperties]);

  useEffect(() => {
    if (erGyldigFodselsnummer(fnrFromParam)) {
      pushAktivBruker();
    }
  }, [fnrFromParam, pushAktivBruker, userProperties.valgtEnhet]);

  return AktivBrukerLoader();
};

export default AppRouter;
