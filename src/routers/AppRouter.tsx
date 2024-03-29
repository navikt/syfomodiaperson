import React, { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AktivBrukerTilgangLaster from "@/components/AktivBrukerTilgangLaster";
import SykmeldingerContainer from "@/sider/sykmeldinger/container/SykmeldingerContainer";
import SykepengesoknaderSide from "@/sider/sykepengsoknader/SykepengesoknaderSide";
import DinSykmeldingContainer from "@/sider/sykmeldinger/container/DinSykmeldingContainer";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import NokkelinformasjonContainer from "@/sider/nokkelinformasjon/container/NokkelinformasjonContainer";
import DialogmoteInnkallingContainer from "../components/dialogmote/innkalling/DialogmoteInnkallingContainer";
import AvlysDialogmoteContainer from "@/sider/mote/components/avlys/AvlysDialogmoteContainer";
import AppSpinner from "../components/AppSpinner";
import DialogmoteReferatContainer from "../components/dialogmote/referat/DialogmoteReferatContainer";
import EndreDialogmoteContainer from "@/sider/mote/components/endre/EndreDialogmoteContainer";
import { OppfoelgingsPlanerOversiktContainer } from "@/sider/oppfolgingsplan/container/OppfoelgingsPlanerOversiktContainer";
import { OppfoelgingsplanContainer } from "@/sider/oppfolgingsplan/container/OppfoelgingsplanContainer";
import { IngenBrukerSide } from "@/components/IngenBrukerSide";
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";
import DialogmoteEndreReferatContainer from "@/components/dialogmote/referat/DialogmoteEndreReferatContainer";
import DialogmoteunntakSkjemaContainer from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaContainer";
import { PersonsokSide } from "@/components/PersonsokSide";
import { AktivitetskravContainer } from "@/sider/aktivitetskrav/AktivitetskravContainer";
import { BehandlerdialogContainer } from "@/sider/behandlerdialog/BehandlerdialogContainer";
import * as Amplitude from "@/utils/amplitude";
import Motelandingsside from "@/sider/mote/Motelandingsside";
import { SykepengesoknadSide } from "@/sider/sykepengsoknader/container/SykepengesoknadSide";
import { ArbeidsuforhetSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";
import { ArbeidsuforhetOppfyltSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetOppfyltSide";

export const appRoutePath = "/sykefravaer";

export const dialogmoteRoutePath = `${appRoutePath}/dialogmote`;
export const dialogmoteUnntakRoutePath = `${appRoutePath}/dialogmoteunntak`;
export const moteoversiktRoutePath = `${appRoutePath}/moteoversikt`;
export const arbeidsuforhetOppfyltPath = `${appRoutePath}/arbeidsuforhet/oppfylt`;

const AktivBrukerRouter = (): ReactElement => {
  Amplitude.logViewportAndScreenSize();

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
            path={`${appRoutePath}/aktivitetskrav`}
            element={<AktivitetskravContainer />}
          />
          <Route
            path={`${appRoutePath}/behandlerdialog`}
            element={<BehandlerdialogContainer />}
          />
          <Route
            path={`${appRoutePath}/logg`}
            element={<HistorikkContainer />}
          />
          <Route path={moteoversiktRoutePath} element={<Motelandingsside />} />
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
            path={`${appRoutePath}/sykmeldinger`}
            element={<SykmeldingerContainer />}
          />
          <Route
            path={`${appRoutePath}/sykepengesoknader`}
            element={<SykepengesoknaderSide />}
          />
          <Route
            path={`${appRoutePath}/arbeidsuforhet`}
            element={<ArbeidsuforhetSide />}
          />
          <Route
            path={arbeidsuforhetOppfyltPath}
            element={<ArbeidsuforhetOppfyltSide />}
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
            path={`${appRoutePath}/personsok`}
            element={<PersonsokSide />}
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
    return <AktivBrukerRouter />;
  }
};

const AppRouter = () => AktivBrukerLoader();

export default AppRouter;
