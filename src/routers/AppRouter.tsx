import React, { ReactElement } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AktivBrukerTilgangLaster from "@/components/AktivBrukerTilgangLaster";
import SykmeldingerContainer from "@/sider/sykmeldinger/container/SykmeldingerContainer";
import SykepengesoknaderSide from "@/sider/sykepengsoknader/SykepengesoknaderSide";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import DialogmoteInnkallingContainer from "../sider/dialogmoter/components/innkalling/DialogmoteInnkallingContainer";
import AvlysDialogmoteContainer from "@/sider/dialogmoter/components/avlys/AvlysDialogmoteContainer";
import AppSpinner from "../components/AppSpinner";
import DialogmoteReferatContainer from "../sider/dialogmoter/components/referat/DialogmoteReferatContainer";
import EndreDialogmoteContainer from "@/sider/dialogmoter/components/endre/EndreDialogmoteContainer";
import { OppfoelgingsPlanerOversiktContainer } from "@/sider/oppfolgingsplan/container/OppfoelgingsPlanerOversiktContainer";
import { OppfoelgingsplanContainer } from "@/sider/oppfolgingsplan/container/OppfoelgingsplanContainer";
import { IngenBrukerSide } from "@/components/IngenBrukerSide";
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";
import DialogmoteunntakSkjemaContainer from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaContainer";
import DialogmoteikkeaktuellSkjemaContainer from "@/sider/dialogmoter/components/ikkeaktuell/DialogmoteikkeaktuellSkjemaContainer";
import { PersonsokSide } from "@/components/PersonsokSide";
import { AktivitetskravContainer } from "@/sider/aktivitetskrav/AktivitetskravContainer";
import { BehandlerdialogContainer } from "@/sider/behandlerdialog/BehandlerdialogContainer";
import * as Amplitude from "@/utils/amplitude";
import Motelandingsside from "@/sider/dialogmoter/Motelandingsside";
import { SykepengesoknadSide } from "@/sider/sykepengsoknader/container/SykepengesoknadSide";
import { ArbeidsuforhetSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";
import { ArbeidsuforhetOppfyltSide } from "@/sider/arbeidsuforhet/oppfylt/ArbeidsuforhetOppfyltSide";
import { Nokkelinformasjon } from "@/sider/nokkelinformasjon/Nokkelinformasjon";
import { ArbeidsuforhetAvslagSide } from "@/sider/arbeidsuforhet/avslag/ArbeidsuforhetAvslagSide";
import { FriskmeldingTilArbeidsformidlingSide } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidlingSide";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import DialogmoteEndreReferatContainer from "@/sider/dialogmoter/components/referat/DialogmoteEndreReferatContainer";
import { Arbeidsuforhet } from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import { ArbeidsuforhetIkkeAktuellSide } from "@/sider/arbeidsuforhet/ikkeaktuell/ArbeidsuforhetIkkeAktuellSide";
import ManglendeMedvirkningSide, {
  ManglendeMedvirkningIkkeAktuellSide,
  ManglendeMedvirkningOppfyltSide,
  ManglendeMedvirkningStansSide,
  ManglendeMedvirkningUnntakSide,
} from "@/sider/manglendemedvirkning/ManglendeMedvirkningSide";
import ManglendeMedvirkning from "@/sider/manglendemedvirkning/ManglendeMedvirkning";
import { DinSykmeldingSide } from "@/sider/sykmeldinger/container/DinSykmeldingSide";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";

export const appRoutePath = "/sykefravaer";

export const dialogmoteRoutePath = `${appRoutePath}/dialogmote`;
export const dialogmoteUnntakRoutePath = `${appRoutePath}/dialogmoteunntak`;
export const dialogmoteIkkeAktuellRoutePath = `${appRoutePath}/dialogmoteikkeaktuell`;
export const moteoversiktRoutePath = `${appRoutePath}/moteoversikt`;
export const arbeidsuforhetOppfyltPath = `${appRoutePath}/arbeidsuforhet/oppfylt`;
export const arbeidsuforhetAvslagPath = `${appRoutePath}/arbeidsuforhet/avslag`;
export const arbeidsuforhetIkkeAktuellPath = `${appRoutePath}/arbeidsuforhet/ikkeaktuell`;
export const arbeidsuforhetPath = `${appRoutePath}/arbeidsuforhet`;
export const frisktilarbeidPath = `${appRoutePath}/frisktilarbeid`;
export const senOppfolgingPath = `${appRoutePath}/senoppfolging`;
export const manglendeMedvirkningPath = `${appRoutePath}/manglendemedvirkning`;
export const manglendeMedvirkningOppfyltPath = `${appRoutePath}/manglendemedvirkning/oppfylt`;
export const manglendeMedvirkningStansPath = `${appRoutePath}/manglendemedvirkning/stans`;
export const manglendeMedvirkningUnntakPath = `${appRoutePath}/manglendemedvirkning/unntak`;
export const manglendeMedvirkningIkkeAktuellPath = `${appRoutePath}/manglendemedvirkning/ikkeaktuell`;
export const historikkPath = `${appRoutePath}/logg`;

const AktivBrukerRouter = (): ReactElement => {
  Amplitude.logViewportAndScreenSize();

  return (
    <AktivBrukerTilgangLaster>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={appRoutePath} />} />
          <Route path={appRoutePath} element={<Nokkelinformasjon />} />
          <Route
            path={`${appRoutePath}/nokkelinformasjon`}
            element={<Nokkelinformasjon />}
          />
          <Route
            path={`${appRoutePath}/aktivitetskrav`}
            element={<AktivitetskravContainer />}
          />
          <Route
            path={`${appRoutePath}/behandlerdialog`}
            element={<BehandlerdialogContainer />}
          />
          <Route path={historikkPath} element={<HistorikkContainer />} />
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
            path={dialogmoteIkkeAktuellRoutePath}
            element={<DialogmoteikkeaktuellSkjemaContainer />}
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
            path={arbeidsuforhetPath}
            element={
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            }
          >
            <Route
              path={arbeidsuforhetPath}
              element={
                <ArbeidsuforhetSide>
                  <Arbeidsuforhet />
                </ArbeidsuforhetSide>
              }
            />
            <Route
              path={arbeidsuforhetOppfyltPath}
              element={<ArbeidsuforhetOppfyltSide />}
            />
            <Route
              path={arbeidsuforhetAvslagPath}
              element={<ArbeidsuforhetAvslagSide />}
            />
            <Route
              path={arbeidsuforhetIkkeAktuellPath}
              element={<ArbeidsuforhetIkkeAktuellSide />}
            />
          </Route>
          <Route
            path={frisktilarbeidPath}
            element={<FriskmeldingTilArbeidsformidlingSide />}
          />
          <Route path={senOppfolgingPath} element={<SenOppfolging />} />
          <Route
            path={manglendeMedvirkningPath}
            element={
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            }
          >
            <Route
              path={manglendeMedvirkningPath}
              element={
                <ManglendeMedvirkningSide>
                  <ManglendeMedvirkning />
                </ManglendeMedvirkningSide>
              }
            />
            <Route
              path={manglendeMedvirkningOppfyltPath}
              element={<ManglendeMedvirkningOppfyltSide />}
            />
            <Route
              path={manglendeMedvirkningStansPath}
              element={<ManglendeMedvirkningStansSide />}
            />
            <Route
              path={manglendeMedvirkningUnntakPath}
              element={<ManglendeMedvirkningUnntakSide />}
            />
            <Route
              path={manglendeMedvirkningIkkeAktuellPath}
              element={<ManglendeMedvirkningIkkeAktuellSide />}
            />
          </Route>
          <Route
            path={`${appRoutePath}/sykepengesoknader/:sykepengesoknadId`}
            element={<SykepengesoknadSide />}
          />
          <Route
            path={`${appRoutePath}/sykmeldinger/:sykmeldingId`}
            element={<DinSykmeldingSide />}
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
