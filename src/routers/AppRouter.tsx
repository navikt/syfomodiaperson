import React, { ReactElement, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";
import DialogmoteEndreReferatContainer from "@/components/dialogmote/referat/DialogmoteEndreReferatContainer";
import DialogmoteunntakSkjemaContainer from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaContainer";

export const appRoutePath = "/sykefravaer";

export const dialogmoteRoutePath = `${appRoutePath}/dialogmote`;
export const dialogmoteUnntakRoutePath = `${appRoutePath}/dialogmoteunntak`;
export const moteoversiktRoutePath = `${appRoutePath}/moteoversikt`;

const AktivBrukerRouter = ({ fnr }: { fnr: string }): ReactElement => {
  return (
    <AktivBrukerTilgangLaster>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={appRoutePath} />} />
          <Route path={appRoutePath} element={<NokkelinformasjonContainer />} />
          <Route
            path={`${appRoutePath}/nokkelinformasjon`}
            element={<NokkelinformasjonContainer />}
          />
          <Route
            path={`${appRoutePath}/logg`}
            element={<HistorikkContainer />}
          />
          <Route
            path={moteoversiktRoutePath}
            element={<MotelandingssideContainer />}
          />
          <Route
            path={`${appRoutePath}/mote`}
            element={<MotebookingContainer />}
          />
          <Route
            path={dialogmoteRoutePath}
            element={<DialogmoteInnkallingContainer />}
          />
          <Route
            path={`${dialogmoteRoutePath}/:dialogmoteUuid/avlys`}
            element={<AvlysDialogmoteContainer />}
          />
          <Route
            path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat`}
            element={<DialogmoteReferatContainer />}
          />
          <Route
            path={`${dialogmoteRoutePath}/:dialogmoteUuid/referat/endre`}
            element={<DialogmoteEndreReferatContainer />}
          />
          <Route
            path={`${dialogmoteRoutePath}/:dialogmoteUuid/endre`}
            element={<EndreDialogmoteContainer />}
          />
          <Route
            path={dialogmoteUnntakRoutePath}
            element={<DialogmoteunntakSkjemaContainer />}
          />
          <Route
            path={`${appRoutePath}/mote/:moteUuid/avbryt`}
            element={<AvbrytMoteContainer fnr={fnr} />}
          />
          <Route
            path={`${appRoutePath}/mote/bekreft/:alternativId`}
            element={<BekreftMoteContainer fnr={fnr} />}
          />
          <Route
            path={`${appRoutePath}/sykmeldinger`}
            element={<SykmeldingerContainer />}
          />
          <Route
            path={`${appRoutePath}/sykepengesoknader`}
            element={<SykepengesoknaderContainer />}
          />
          <Route
            path={`${appRoutePath}/sykepengesoknader/:sykepengesoknadId`}
            element={<SykepengesoknadSide />}
          />
          <Route
            path={`${appRoutePath}/sykmeldinger/:sykmeldingId`}
            element={<DinSykmeldingContainer />}
          />
          <Route
            path={`${appRoutePath}/oppfoelgingsplaner`}
            element={<OppfoelgingsPlanerOversiktContainer />}
          />
          <Route
            path={`${appRoutePath}/oppfoelgingsplaner/:oppfoelgingsdialogId`}
            element={<OppfoelgingsplanContainer />}
          />
          <Route
            path={`${appRoutePath}/vedtak`}
            element={<VedtakContainer />}
          />
          <Route path="*" element={<Navigate to={appRoutePath} />} />
        </Routes>
      </BrowserRouter>
    </AktivBrukerTilgangLaster>
  );
};

const IngenAktivBrukerRouter = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<IngenBrukerSide />} />
      </Routes>
    </BrowserRouter>
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
  const userProperties = useUserProperties();

  useEffect(() => {
    if (userProperties.valgtEnhet) {
      setAmplitudeUserProperties(userProperties);
    }
  }, [userProperties]);

  return AktivBrukerLoader();
};

export default AppRouter;
