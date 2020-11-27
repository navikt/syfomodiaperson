import React from "react";
import PropTypes from "prop-types";
import {
  senesteTom,
  tidligsteFom,
  tilLesbarPeriodeMedArstall,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import { Utvidbar } from "@navikt/digisyfo-npm";
import EtikettBase from "nav-frontend-etiketter";
import SykmeldingMotebehovVisning from "./SykmeldingMotebehovVisning";
import {
  erEkstraInformasjonISykmeldingen,
  arbeidsgivernavnEllerArbeidssituasjon,
  sykmeldingerMedStatusSendt,
  sykmeldingerInnenforOppfolgingstilfellet,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingperioderSortertEldstTilNyest,
  stringMedAlleGraderingerFraSykmeldingPerioder,
} from "../../utils/sykmeldinger/sykmeldingUtils";
import Lenke from "nav-frontend-lenker";
import { finnMiljoStreng } from "../../utils/miljoUtil";

const tekster = {
  header: "Utdrag fra sykefraværet",
  oppfolgingsplaner: {
    header: "Oppfølgingsplan",
    ingenPlanerDelt: "Ingen planer er delt med NAV",
  },
  sykmeldinger: {
    header: "Sykmeldinger",
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

export const Oppfolgingsplaner = ({ aktiveDialoger, fnr }) => {
  return (
    <div className="utdragFraSykefravaeret__oppfolgingsplaner">
      <h3>{tekster.oppfolgingsplaner.header}</h3>
      {aktiveDialoger && aktiveDialoger.length > 0 ? (
        aktiveDialoger.map((dialog, index) => {
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

Oppfolgingsplaner.propTypes = {
  aktiveDialoger: PropTypes.arrayOf(PropTypes.object),
  fnr: PropTypes.string,
};

export const UtvidbarTittel = ({ sykmelding }) => {
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

UtvidbarTittel.propTypes = {
  sykmelding: sykmeldingPt,
};

export const SykmeldingerForVirksomhet = ({ sykmeldinger }) => {
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

SykmeldingerForVirksomhet.propTypes = {
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export const Sykmeldinger = ({ oppfolgingstilfelleperioder, sykmeldinger }) => {
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

Sykmeldinger.propTypes = {
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export const Samtalereferat = ({ fnr }) => {
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

Samtalereferat.propTypes = {
  fnr: PropTypes.string,
};

const UtdragFraSykefravaeret = ({
  aktiveDialoger,
  fnr,
  oppfolgingstilfelleperioder,
  sykmeldinger,
}) => {
  return (
    <div>
      <UtdragFraSykefravaeretHeader />

      <div className="panel utdragFraSykefravaeret">
        <Oppfolgingsplaner aktiveDialoger={aktiveDialoger} fnr={fnr} />

        <Sykmeldinger
          fnr={fnr}
          oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
          sykmeldinger={sykmeldinger}
        />

        <Samtalereferat fnr={fnr} />
      </div>
    </div>
  );
};

UtdragFraSykefravaeret.propTypes = {
  aktiveDialoger: PropTypes.arrayOf(PropTypes.object),
  fnr: PropTypes.string,
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export default UtdragFraSykefravaeret;
