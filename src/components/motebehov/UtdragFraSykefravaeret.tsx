import React from "react";
import EtikettBase from "nav-frontend-etiketter";
import Lenke from "nav-frontend-lenker";
import { OppfolgingsplanDTO } from "../../data/oppfolgingsplan/oppfoelgingsdialoger";
import SykmeldingMotebehovVisning from "./SykmeldingMotebehovVisning";
import {
  erEkstraInformasjonISykmeldingen,
  arbeidsgivernavnEllerArbeidssituasjon,
  sykmeldingerUtenArbeidsgiver,
  sykmeldingerMedStatusSendt,
  sykmeldingerInnenforOppfolgingstilfellet,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingperioderSortertEldstTilNyest,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerInnenforOppfolgingstilfellePerson,
} from "../../utils/sykmeldinger/sykmeldingUtils";
import { finnMiljoStreng } from "../../utils/miljoUtil";
import { OppfolgingstilfellePerson } from "../../data/oppfolgingstilfelle/types/OppfolgingstilfellePerson";
import { tilLesbarPeriodeMedArstall } from "../../utils/datoUtils";
import { senesteTom, tidligsteFom } from "../../utils/periodeUtils";
import Utvidbar from "../Utvidbar";

const tekster = {
  header: "Utdrag fra sykefraværet",
  oppfolgingsplaner: {
    header: "Oppfølgingsplan",
    ingenPlanerDelt: "Ingen planer er delt med NAV",
  },
  sykmeldinger: {
    header: "Sykmeldinger",
    headerUtenArbeidsgiver: "Sykmeldinger uten arbeidsgiver",
    papirLabelText: "Papir",
  },
  samtalereferat: {
    header: "Samtalereferat",
    lenkeTekst: "Samtalereferat",
  },
};

export const UtdragFraSykefravaeretHeader = () => {
  return (
    <div className="utdragFraSykefravaeret__header">
      <h2>{tekster.header}</h2>
    </div>
  );
};

interface OppfolgingsplanerProps {
  fnr: string;
  aktiveDialoger: OppfolgingsplanDTO[];
}

export const Oppfolgingsplaner = (
  oppfolgingsplanerProps: OppfolgingsplanerProps
) => {
  const { aktiveDialoger, fnr } = oppfolgingsplanerProps;
  return (
    <div className="utdragFraSykefravaeret__oppfolgingsplaner">
      <h3>{tekster.oppfolgingsplaner.header}</h3>
      {aktiveDialoger && aktiveDialoger.length > 0 ? (
        aktiveDialoger.map((dialog: any, index: number) => {
          const virksomhetsNavn = dialog.virksomhet.navn;
          return (
            <div
              key={index}
              className="utdragFraSykefravaeret__oppfolgingsplan"
            >
              <span>
                <Lenke
                  className="lenke"
                  href={`/sykefravaer/${fnr}/oppfoelgingsplaner/${dialog.id}`}
                >
                  {virksomhetsNavn && virksomhetsNavn.length > 0
                    ? virksomhetsNavn.toLowerCase()
                    : dialog.virksomhet.virksomhetsnummer}
                </Lenke>
              </span>
              <span className="gyldighetsperiode">
                {tilLesbarPeriodeMedArstall(
                  dialog.godkjentPlan.gyldighetstidspunkt.fom,
                  dialog.godkjentPlan.gyldighetstidspunkt.tom
                )}
              </span>
            </div>
          );
        })
      ) : (
        <p>{tekster.oppfolgingsplaner.ingenPlanerDelt}</p>
      )}
    </div>
  );
};

interface UtvidbarTittelProps {
  sykmelding: any;
}

export const UtvidbarTittel = (utvidbarTittelProps: UtvidbarTittelProps) => {
  const sykmelding = utvidbarTittelProps.sykmelding;
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);
  const sykmeldingPerioderSortertEtterDato = sykmeldingperioderSortertEldstTilNyest(
    sykmelding.mulighetForArbeid.perioder
  );
  const showPapirLabel = sykmelding.papirsykmelding;
  return (
    <div className="utdragFraSykefravaeret__utvidbarTittel">
      <div>
        <span className="utvidbarTittel__periode">{`${tilLesbarPeriodeMedArstall(
          tidligsteFom(sykmelding.mulighetForArbeid.perioder),
          senesteTom(sykmelding.mulighetForArbeid.perioder)
        )}: `}</span>
        {sykmelding.diagnose.hoveddiagnose && (
          <span className="utvidbarTittel__diagnose">
            {`${sykmelding.diagnose.hoveddiagnose.diagnosekode} - ${sykmelding.diagnose.hoveddiagnose.diagnose}`}
          </span>
        )}
        <span className="utvidbarTittel__grad">
          {stringMedAlleGraderingerFraSykmeldingPerioder(
            sykmeldingPerioderSortertEtterDato
          )}
        </span>
        {showPapirLabel && (
          <EtikettBase className="utvidbarTittel__etikett" type="info">
            {tekster.sykmeldinger.papirLabelText}
          </EtikettBase>
        )}
      </div>
      {erViktigInformasjon && (
        <div className="utvidbarTittel__erViktig">
          <img alt="Mer" src={"/sykefravaer/img/svg/merInformasjon.svg"} />
        </div>
      )}
    </div>
  );
};

interface SykmeldingerForVirksomhetProps {
  sykmeldinger: any[];
}

export const SykmeldingerForVirksomhet = (
  sykmeldingerForVirksomhetProps: SykmeldingerForVirksomhetProps
) => {
  const sykmeldinger = sykmeldingerForVirksomhetProps.sykmeldinger;
  return (
    <div className="utdragFraSykefravaeret__sykmeldingerForVirksomhet">
      <h4>
        {arbeidsgivernavnEllerArbeidssituasjon(sykmeldinger[0]).toLowerCase()}
      </h4>
      {sykmeldinger.map((sykmelding, index) => {
        return (
          <div key={index}>
            <Utvidbar
              tittel={<UtvidbarTittel sykmelding={sykmelding} />}
              visLukkLenke={false}
              children={<SykmeldingMotebehovVisning sykmelding={sykmelding} />}
            />
          </div>
        );
      })}
    </div>
  );
};

interface SykmeldingerProps {
  oppfolgingstilfelleperioder: any[];
  sykmeldinger: any[];
}

export const Sykmeldinger = (sykmeldingerProps: SykmeldingerProps) => {
  const { oppfolgingstilfelleperioder, sykmeldinger } = sykmeldingerProps;

  const innsendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet = sykmeldingerInnenforOppfolgingstilfellet(
    innsendteSykmeldinger,
    oppfolgingstilfelleperioder
  );
  const sykmeldingerSortertPaaUtstedelsesdato = sykmeldingerSortertNyestTilEldst(
    sykmeldingerIOppfolgingstilfellet
  );
  const sykmeldingerSortertPaaVirksomhet = sykmeldingerGruppertEtterVirksomhet(
    sykmeldingerSortertPaaUtstedelsesdato
  );
  return (
    <div className="utdragFraSykefravaeret__sykmeldinger">
      <h3>{tekster.sykmeldinger.header}</h3>
      {Object.keys(sykmeldingerSortertPaaVirksomhet).map((key, index) => {
        return (
          <SykmeldingerForVirksomhet
            key={index}
            sykmeldinger={sykmeldingerSortertPaaVirksomhet[key]}
          />
        );
      })}
    </div>
  );
};

interface SykmeldingerUtenArbeidsgiverProps {
  oppfolgingstilfelleUtenArbeidsgiver: OppfolgingstilfellePerson;
  sykmeldinger: any[];
}

export const SykmeldingerUtenArbeidsgiver = (
  sykmeldingerUtenArbeidsgiverProps: SykmeldingerUtenArbeidsgiverProps
) => {
  const {
    oppfolgingstilfelleUtenArbeidsgiver,
    sykmeldinger,
  } = sykmeldingerUtenArbeidsgiverProps;
  const innsendteSykmeldinger = sykmeldingerUtenArbeidsgiver(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet = sykmeldingerInnenforOppfolgingstilfellePerson(
    innsendteSykmeldinger,
    oppfolgingstilfelleUtenArbeidsgiver
  );
  const sykmeldingerSortertPaUtstedelsesdato = sykmeldingerSortertNyestTilEldst(
    sykmeldingerIOppfolgingstilfellet
  );
  return (
    <div className="utdragFraSykefravaeret__sykmeldinger">
      <h3>{tekster.sykmeldinger.headerUtenArbeidsgiver}</h3>
      {sykmeldingerSortertPaUtstedelsesdato.length > 0 &&
        sykmeldingerSortertPaUtstedelsesdato.map(
          (sykmelding: any, index: number) => {
            return (
              <div
                className="utdragFraSykefravaeret__sykmeldingerForVirksomhet"
                key={index}
              >
                <Utvidbar
                  tittel={<UtvidbarTittel sykmelding={sykmelding} />}
                  visLukkLenke={false}
                  children={
                    <SykmeldingMotebehovVisning sykmelding={sykmelding} />
                  }
                />
              </div>
            );
          }
        )}
    </div>
  );
};

interface SamtalereferatProps {
  fnr: string;
}

export const Samtalereferat = (samtalereferatProps: SamtalereferatProps) => {
  const fnr = samtalereferatProps.fnr;
  return (
    <div className="utdragFraSykefravaeret__samtalereferat">
      <h3>{tekster.samtalereferat.header}</h3>
      <Lenke
        className="lenke"
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {tekster.samtalereferat.lenkeTekst}
      </Lenke>
    </div>
  );
};

interface UtdragFraSykefravaeretProps {
  aktiveDialoger: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingstilfelleUtenArbeidsgiver?: OppfolgingstilfellePerson;
  oppfolgingstilfelleperioder: any[];
  sykmeldinger: any[];
}

const UtdragFraSykefravaeret = (
  utdragFraSykefravaeretProps: UtdragFraSykefravaeretProps
) => {
  const {
    aktiveDialoger,
    fnr,
    oppfolgingstilfelleUtenArbeidsgiver,
    oppfolgingstilfelleperioder,
    sykmeldinger,
  } = utdragFraSykefravaeretProps;
  return (
    <div>
      <UtdragFraSykefravaeretHeader />

      <div className="panel utdragFraSykefravaeret">
        <Oppfolgingsplaner aktiveDialoger={aktiveDialoger} fnr={fnr} />

        <Sykmeldinger
          oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
          sykmeldinger={sykmeldinger}
        />

        {oppfolgingstilfelleUtenArbeidsgiver && (
          <SykmeldingerUtenArbeidsgiver
            oppfolgingstilfelleUtenArbeidsgiver={
              oppfolgingstilfelleUtenArbeidsgiver
            }
            sykmeldinger={sykmeldinger}
          />
        )}

        <Samtalereferat fnr={fnr} />
      </div>
    </div>
  );
};

export default UtdragFraSykefravaeret;
