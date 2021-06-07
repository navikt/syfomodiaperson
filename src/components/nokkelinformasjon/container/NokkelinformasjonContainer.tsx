import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hentOppfoelgingsdialoger } from "../../../data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import { hentOppfolgingstilfellerPersonUtenArbeidsiver } from "../../../data/oppfolgingstilfelle/oppfolgingstilfellerperson_actions";
import { hentOppfolgingstilfelleperioder } from "../../../data/oppfolgingstilfelle/oppfolgingstilfelleperioder_actions";
import { hentSykmeldinger } from "../../../data/sykmelding/sykmeldinger_actions";
import { hentLedere } from "../../../data/leder/ledere_actions";
import { NOKKELINFORMASJON } from "../../../enums/menypunkter";
import { harForsoktHentetLedere } from "../../../utils/reducerUtils";
import Side from "../../../sider/Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import { useOppfoelgingsDialoger } from "../../../hooks/useOppfoelgingsDialoger";
import { useValgtPersonident } from "../../../hooks/useValgtBruker";
import SideLaster from "../../SideLaster";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const fnr = useValgtPersonident();

  const {
    aktiveDialoger,
    harForsoktHentetOppfoelgingsdialoger,
  } = useOppfoelgingsDialoger();

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

  const harForsoktHentetAlt =
    harForsoktHentetOppfoelgingsdialoger && harForsoktHentetLedere(ledereState);

  const henter = !harForsoktHentetAlt;
  const hentingFeilet = sykmeldingerState.hentingFeilet;
  const sykmeldinger = sykmeldingerState.data;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentLedere(fnr));
    dispatch(hentSykmeldinger(fnr));
    if (fnr) {
      dispatch(hentOppfoelgingsdialoger(fnr));
    }
  }, []);

  useEffect(() => {
    dispatch(hentOppfolgingstilfellerPersonUtenArbeidsiver(fnr));
  }, [sykmeldingerState]);

  useEffect(() => {
    dispatch(hentOppfolgingstilfelleperioder(fnr));
  }, [ledereState, sykmeldingerState]);

  return (
    <Side
      fnr={fnr}
      tittel={texts.pageTitle}
      aktivtMenypunkt={NOKKELINFORMASJON}
    >
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
