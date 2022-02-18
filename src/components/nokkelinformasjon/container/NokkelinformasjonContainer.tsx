import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hentOppfolgingstilfellerPersonUtenArbeidsiver } from "@/data/oppfolgingstilfelle/oppfolgingstilfellerperson_actions";
import { hentOppfolgingstilfelleperioder } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder_actions";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import { hentLedere } from "@/data/leder/ledere_actions";
import { NOKKELINFORMASJON } from "@/enums/menypunkter";
import Side from "../../../sider/Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../SideLaster";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const fnr = useValgtPersonident();
  const {
    aktiveDialoger,
    isLoading: henterOppfolgingsplaner,
  } = useOppfolgingsplanerQuery();

  const oppfolgingstilfelleperioder = useSelector(
    (state: any) => state.oppfolgingstilfelleperioder
  );

  const oppfolgingstilfelleUtenArbeidsgiverState = useSelector(
    (state: any) => state.oppfolgingstilfellerperson
  );
  const oppfolgingstilfelleUtenArbeidsgiver =
    oppfolgingstilfelleUtenArbeidsgiverState.data[0] || {};

  const ledereState = useSelector((state: any) => state.ledere);
  const sykmeldingerState = useSelector((state: any) => state.sykmeldinger);

  const henter = !ledereState.hentingForsokt || henterOppfolgingsplaner;
  const hentingFeilet = sykmeldingerState.hentingFeilet;
  const sykmeldinger = sykmeldingerState.data;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentLedere(fnr));
    dispatch(hentSykmeldinger(fnr));
    dispatch(hentOppfolgingstilfellerPersonUtenArbeidsiver(fnr));
    dispatch(hentOppfolgingstilfelleperioder(fnr));
  }, [dispatch, fnr, ledereState]);

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={NOKKELINFORMASJON}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Nokkelinformasjon
          fnr={fnr}
          aktiveDialoger={aktiveDialoger}
          oppfolgingstilfelleUtenArbeidsgiver={
            oppfolgingstilfelleUtenArbeidsgiver
          }
          oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
          sykmeldinger={sykmeldinger}
          pageTitle={texts.pageTitle}
        />
      </SideLaster>
    </Side>
  );
};

export default NokkelinformasjonSide;
