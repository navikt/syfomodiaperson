import React, { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AktivBrukerTilgangLaster from "@/components/AktivBrukerTilgangLaster";
import SykmeldingerSide from "@/sider/sykmeldinger/container/SykmeldingerSide";
import SykepengesoknaderSide from "@/sider/sykepengsoknader/SykepengesoknaderSide";
import HistorikkContainer from "@/sider/historikk/container/HistorikkContainer";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import DialogmoteInnkallingContainer from "../sider/dialogmoter/components/innkalling/DialogmoteInnkallingContainer";
import AvlysDialogmoteContainer from "@/sider/dialogmoter/components/avlys/AvlysDialogmoteContainer";
import AppSpinner from "../components/AppSpinner";
import DialogmoteReferatContainer from "../sider/dialogmoter/components/referat/DialogmoteReferatContainer";
import EndreDialogmoteContainer from "@/sider/dialogmoter/components/endre/EndreDialogmoteContainer";
import { IngenBrukerSide } from "@/components/IngenBrukerSide";
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";
import DialogmoteunntakSkjemaContainer from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaContainer";
import DialogmoteikkeaktuellSkjemaContainer from "@/sider/dialogmoter/components/ikkeaktuell/DialogmoteikkeaktuellSkjemaContainer";
import { PersonsokSide } from "@/components/PersonsokSide";
import BehandlerdialogContainer from "@/sider/behandlerdialog/BehandlerdialogContainer";
import Motelandingsside from "@/sider/dialogmoter/Motelandingsside";
import Nokkelinformasjon from "@/sider/nokkelinformasjon/Nokkelinformasjon";
import FriskmeldingTilArbeidsformidlingSide from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidlingSide";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import DialogmoteEndreReferatContainer from "@/sider/dialogmoter/components/referat/DialogmoteEndreReferatContainer";
import ManglendeMedvirkningSide from "@/sider/manglendemedvirkning/ManglendeMedvirkningSide";
import ManglendeMedvirkning from "@/sider/manglendemedvirkning/ManglendeMedvirkning";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import OppfolgingsplanContainer from "@/sider/oppfolgingsplan/container/OppfolgingsplanContainer";
import OppfoelgingsPlanerOversiktContainer from "@/sider/oppfolgingsplan/container/OppfoelgingsPlanerOversiktContainer";
import SykepengesoknadSide from "@/sider/sykepengsoknader/container/SykepengesoknadSide";
import Arbeidsuforhet from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import ArbeidsuforhetAvslag from "@/sider/arbeidsuforhet/avslag/ArbeidsuforhetAvslag";
import ArbeidsuforhetIkkeAktuell from "@/sider/arbeidsuforhet/ikkeaktuell/ArbeidsuforhetIkkeAktuell";
import SendForhandsvarselSkjema from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import ArbeidsuforhetSide from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";
import SykmeldingSide from "@/sider/sykmeldinger/container/SykmeldingSide";
import InnstillingUtenForhandsvarsel from "@/sider/arbeidsuforhet/innstillingutenforhandsvarsel/InnstillingUtenForhandsvarsel";
import OppfyltSide from "@/sider/manglendemedvirkning/oppfylt/OppfyltSide";
import StansSide from "@/sider/manglendemedvirkning/stans/StansSide";
import IkkeAktuellSide from "@/sider/manglendemedvirkning/ikkeaktuell/IkkeAktuellSide";
import UnntakSide from "@/sider/manglendemedvirkning/unntak/UnntakSide";
import { AktivitetskravContainer } from "@/sider/aktivitetskrav/AktivitetskravContainer";
import OppfyltForm from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";
import KartleggingssporsmalSide from "@/sider/kartleggingssporsmal/KartleggingssporsmalSide";
import * as Umami from "@/utils/umami";

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
export const historikkPath = `${appRoutePath}/historikk`;

function AktivBrukerRouter({
  veilederident,
}: {
  veilederident: string;
}): ReactElement {
  Umami.setIdentifier(veilederident);

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

          <Route path={`${appRoutePath}/sykmeldinger`}>
            <Route index element={<SykmeldingerSide />} />
            <Route path=":sykmeldingId" element={<SykmeldingSide />} />
          </Route>

          <Route path={`${appRoutePath}/sykepengesoknader`}>
            <Route index element={<SykepengesoknaderSide />} />
            <Route
              path=":sykepengesoknadId"
              element={<SykepengesoknadSide />}
            />
          </Route>

          <Route
            path={`${appRoutePath}/behandlerdialog`}
            element={<BehandlerdialogContainer />}
          />
          <Route path={moteoversiktRoutePath} element={<Motelandingsside />} />

          <Route path={dialogmoteRoutePath}>
            <Route index element={<DialogmoteInnkallingContainer />} />
            <Route
              path=":dialogmoteUuid/avlys"
              element={<AvlysDialogmoteContainer />}
            />
            <Route
              path=":dialogmoteUuid/referat"
              element={<DialogmoteReferatContainer />}
            />
            <Route
              path=":dialogmoteUuid/referat/endre"
              element={<DialogmoteEndreReferatContainer />}
            />
            <Route
              path=":dialogmoteUuid/endre"
              element={<EndreDialogmoteContainer />}
            />
          </Route>

          <Route
            path={dialogmoteUnntakRoutePath}
            element={<DialogmoteunntakSkjemaContainer />}
          />
          <Route
            path={dialogmoteIkkeAktuellRoutePath}
            element={<DialogmoteikkeaktuellSkjemaContainer />}
          />

          <Route
            path={`${appRoutePath}/kartleggingssporsmal`}
            element={<KartleggingssporsmalSide />}
          />

          <Route
            path={`${appRoutePath}/aktivitetskrav`}
            element={<AktivitetskravContainer />}
          />

          <Route
            path={manglendeMedvirkningPath}
            element={
              <NotificationProvider>
                <ManglendeMedvirkningSide />
              </NotificationProvider>
            }
          >
            <Route index element={<ManglendeMedvirkning />} />
            <Route path="oppfylt" element={<OppfyltSide />} />
            <Route path="stans" element={<StansSide />} />
            <Route path="unntak" element={<UnntakSide />} />
            <Route path="ikkeaktuell" element={<IkkeAktuellSide />} />
          </Route>

          <Route
            path={arbeidsuforhetPath}
            element={
              <NotificationProvider>
                <ArbeidsuforhetSide />
              </NotificationProvider>
            }
          >
            <Route index element={<Arbeidsuforhet />} />
            <Route
              path="forhandsvarsel"
              element={<SendForhandsvarselSkjema />}
            />
            <Route
              path="innstilling-uten-forhandsvarsel"
              element={<InnstillingUtenForhandsvarsel />}
            />
            <Route path="oppfylt" element={<OppfyltForm />} />
            <Route path="avslag" element={<ArbeidsuforhetAvslag />} />
            <Route path="ikkeaktuell" element={<ArbeidsuforhetIkkeAktuell />} />
          </Route>

          <Route
            path={frisktilarbeidPath}
            element={<FriskmeldingTilArbeidsformidlingSide />}
          />

          <Route path={senOppfolgingPath} element={<SenOppfolging />} />

          <Route path={`${appRoutePath}/oppfoelgingsplaner`}>
            <Route index element={<OppfoelgingsPlanerOversiktContainer />} />
            <Route
              path=":oppfoelgingsdialogId"
              element={<OppfolgingsplanContainer />}
            />
          </Route>

          <Route path={historikkPath} element={<HistorikkContainer />} />

          <Route
            path={`${appRoutePath}/personsok`}
            element={<PersonsokSide />}
          />
          <Route path="*" element={<Navigate to={appRoutePath} />} />
        </Routes>
      </BrowserRouter>
    </AktivBrukerTilgangLaster>
  );
}

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
    return <AktivBrukerRouter veilederident={data.aktivBruker} />;
  }
};

const AppRouter = () => AktivBrukerLoader();

export default AppRouter;
