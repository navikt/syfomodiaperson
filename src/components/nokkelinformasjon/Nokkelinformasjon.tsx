import React from "react";
import styled from "styled-components";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/oppfoelgingsdialoger";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { useAppSelector } from "@/hooks/hooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

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
  oppfolgingstilfellePerson?: OppfolgingstilfellePersonDTO;
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
    oppfolgingstilfellePerson,
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
          oppfolgingstilfellePerson={oppfolgingstilfellePerson}
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
