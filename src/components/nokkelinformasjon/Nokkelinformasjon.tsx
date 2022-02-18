import React from "react";
import styled from "styled-components";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { useAppSelector } from "@/hooks/hooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

const texts = {
  comingSoon: `
       Denne siden er under utvikling. 
    `,
};

const AlertStripeDevelopment = styled(AlertStripeInfo)`
  margin: 0 0 1em 0;
`;

interface MeldingTilArbeidsgiverProps {
  aktiveDialoger: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingstilfelleUtenArbeidsgiver: any;
  oppfolgingstilfelleperioder: any;
  sykmeldinger: any;
  pageTitle: string;
}

const Nokkelinformasjon = (
  meldingTilArbeidsgiverProps: MeldingTilArbeidsgiverProps
) => {
  const {
    aktiveDialoger,
    fnr,
    oppfolgingstilfelleUtenArbeidsgiver,
    oppfolgingstilfelleperioder,
    sykmeldinger,
    pageTitle,
  } = meldingTilArbeidsgiverProps;

  const { toggles } = useAppSelector((state) => state.unleash);
  const visSykmeldingsgrad = toggles[ToggleNames.sykmeldingsgrad];

  return (
    <div>
      <Sidetopp tittel={pageTitle} />

      <AlertStripeDevelopment>{texts.comingSoon}</AlertStripeDevelopment>

      {visSykmeldingsgrad && (
        <Sykmeldingsgrad
          sykmeldinger={sykmeldinger}
          oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        />
      )}

      <UtdragFraSykefravaeret
        aktiveDialoger={aktiveDialoger}
        fnr={fnr}
        oppfolgingstilfelleUtenArbeidsgiver={
          oppfolgingstilfelleUtenArbeidsgiver
        }
        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        sykmeldinger={sykmeldinger}
      />
    </div>
  );
};

export default Nokkelinformasjon;
